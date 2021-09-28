from schemas import user as sus
from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user
from functools import wraps
from hashlib import md5
from cerberus import Validator


def changepass(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if request.headers.environ['REQUEST_METHOD'] == 'POST':
            if not ("HTTP_AUTHORIZATION" in request.headers.environ):
                return make_response(jsonify(message='No authorization'), 401)
            re = request.headers.environ['HTTP_AUTHORIZATION']
            rw = re.split(' ')
            if rw[0] != 'Bearer':
                return make_response(jsonify(message='No authorization'), 401)
            loc_us = user.User().getUserById(kwargs['us_id'])
            if rw[1] != loc_us.recov_uid:
                return make_response(jsonify(message='Incorrect recovery UID'), 401)
            p_schema = {"password": {'type': 'string', 'maxlength': 30, 'minlength' : 6}}
            v = Validator()
            res = v.validate(request.json, p_schema)
            if not res:
                return make_response(jsonify({"errors": v.errors}), 422)
            user.User().doChangePassword(loc_us.id,request.json['password'])
            return make_response(jsonify(message='Password successfully changed'), 200)
        fun = func(*args, **kwargs)
        return fun

    return wrapper


class User(Resource):
    method_decorators = [authenticate, changepass]

    def get(self, us_id):
        us = user.User().userCurrObj()
        if us.id!=us_id and us.admin_level < 10:
            return make_response(jsonify(result="insufficient privileges"), 400)
        us.dmp = sus.SUser2()
        q = us.get_one(us_id)
        return make_response(q.dump_object(),200)


    def post(self, us_id):
        us = user.User().userCurrObj()
        if us.id != us_id and us.admin_level < 10:
            return make_response(jsonify(result="insufficient privileges"), 400)
        if us.admin_level < 10:
            if 'admin_level' in request.json.keys():
                request.json['admin_level'] = us.admin_level
        if 'email' in request.json.keys():
            del request.json['email']

        p_schema = {"admin_level": {'type': 'integer'},
                    "firstname": {'type':'string','maxlength': 30},
                    "id": {'type': 'integer'},
                    "lastname": {'type':'string','maxlength': 30},
                    "userinfo": {'type':'string','maxlength': 200},
                    "username": {'type':'string','minlength': 3, 'maxlength': 30},
                    "usershortinfo": {'type':'string','maxlength': 200}}
        v = Validator()
        v.allow_unknown = True
        res = v.validate(request.json, p_schema)
        if res:
            f = user.User()
            f.post(us_id)
            return make_response(jsonify(result=us_id), 200)
        return make_response(jsonify({"errors": v.errors}), 422)


    def delete(self, us_id):
        us = user.User().userCurrObj()
        if us.id != us_id and us.admin_level < 10:
            return make_response(jsonify(result="insufficient privileges"), 400)
        user.User().delete(us_id)
        return make_response(jsonify(result='OK'), 204)


def createnew(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if request.headers.environ['REQUEST_METHOD'] == 'POST':
            if ("HTTP_AUTHORIZATION" in request.headers.environ):
                if ((request.headers.environ['HTTP_AUTHORIZATION']).split(' ')[0]!= 'Bearer') and ((request.headers.environ['HTTP_AUTHORIZATION']).split(' ')[1] != None):
                   fun = func(*args, **kwargs)
                   return fun
            p_schema = {"admin_level": {'type': 'integer'},
                        "firstname": {'type': 'string', 'maxlength': 30},
                        "id": {'type': 'integer'},
                        "email": {'type': 'string', 'maxlength': 100},
                        "lastname": {'type': 'string', 'maxlength': 30},
                        "userinfo": {'type': 'string', 'maxlength': 200},
                        "username": {'type': 'string', 'minlength': 3, 'maxlength': 30},
                        "userpass": {'type': 'string', 'maxlength': 30, 'minlength' : 6},
                        "usershortinfo": {'type': 'string', 'maxlength': 200}}
            v = Validator()
            res = v.validate(request.json, p_schema)
            if not(res):
                return make_response(jsonify({"errors": v.errors}), 422)
            del request.json["id"]
            request.json["admin_level"] = 5
            request.json["userpass"] = md5(request.json["userpass"].encode('utf-8')).hexdigest()
            f = user.User()
            if f.isEmailPresent(request.json['email']):
                return make_response(jsonify({"errors": "User with email already present in database!"}), 400)
            if f.isUsernamePresent(request.json['username']):
                return make_response(jsonify({"errors": "User already present in database!"}), 400)
            f.post()
            f.doApproveMail(request.json['email'])
            return make_response(jsonify({"message": "Successful create user"}), 200)
        fun = func(*args, **kwargs)
        return fun

    return wrapper

class UserList(Resource):
    method_decorators = [authenticate, createnew]

    def get(self):
        us = user.User().userCurrObj()
        us.dmp = sus.SUser2()
        wh = ''
        if (us.admin_level < 10):
            wh = text('id = %i'%(us.id))
        q = us.get_list_of(wh = wh)
        return make_response(jsonify(q), 200)

    # здесь только создание, без пароля
    def post(self):
        us = user.User().userCurrObj()
        if (us.admin_level < 10):
            return make_response(jsonify(result="insufficient privileges"), 400)
        if 'id' in request.json.keys():
            del request.json['id']
        res = user.User().post()
        return make_response(jsonify(result=res), 200)


class UserLogin(ResFree):
    def post(self):
        jsonData = request.get_json()
        loginResult = user.User().doLogin(jsonData)
        if loginResult == 'invalid':
            return make_response(jsonify({"error":"true", "message":"Wrong credentials"}), 401)
        if loginResult == 'unconfirmed':
            return make_response(jsonify({"error":"true", "message":"Email unconfirmed"}), 403)
        if loginResult == 'invalidFormat':
            return make_response(jsonify({"error":"true", "message":"Invalid user name or password entry format"}), 401)

        return make_response(jsonify(access_token=loginResult), 200)


class PutUserData(Resource):
    def put(self):
        jsonData = request.get_json(force=True)
        user.User().doUserСhangeData(jsonData)
        return make_response(jsonify({"message":"Successful"}), 202)


class UserLogout(Resource):
    def get(self):
        user.User().doUnLogin()
        return make_response(jsonify({"message":"Successful"}), 202)


class UserRegister(ResFree):
    def post(self):
        jsonData = request.get_json(force=True)
        registrResult = user.User().doRegisterUser(jsonData)
        if registrResult == 'true':
            return make_response(jsonify({"message": "Created"}), 201)
        elif registrResult == 'missing arguments':
            return make_response(jsonify({"error":"true", "message": "Missing arguments"}), 400)
        elif registrResult == 'exists':
            return make_response(jsonify({"error":"true", "message": "User already exists"}), 400)

        elif registrResult ==('invalidFormat'):
            return make_response(jsonify({"error":"true", "message": "Invalid format"}), 400)



class UserCurrent(Resource):
    def get(self):
        q = user.User().userCurrent()
        return make_response(jsonify(q), 201)

############################################################ Email funcs

class SendingResetPasswordMail(ResFree):
    def get(self, username):
        sendingResult = user.User().doSendingMail(username)
        if sendingResult == 'true':
            return make_response(jsonify({"message": "Successful"}), 201)
        return make_response(jsonify({"error": "true", "message": "didnt exists"}), 400)


class ForgotPassword(ResFree):
    def post(self):
        p_schema = {"email": {'type': 'string'}}
        v = Validator()
        res = v.validate(request.json, p_schema)
        if not res:
            return make_response(jsonify({"errors": v.errors}), 422)
        sr_code, sr_mess = user.User().doSendingMail(request.json['email'])
        return make_response(jsonify({"message": sr_mess}), sr_code)


class ChangePasswordViaToken(ResFree):
    def post(self, usertoken):
        jsonData = request.get_json(force=True)
        changeResult = user.User().doChangePassword(usertoken,jsonData)
        if changeResult == 'true':
            return make_response(jsonify({"message": "Successful"}), 201)
        if changeResult == 'invalidFormat':
            return make_response(jsonify({"error": "true", "message": "Invalid format"}), 400)


class ApplyMailByToken(ResFree):
    def get(self, usertoken):
        changeResult = user.User().doVerifyEmail(usertoken)
        if changeResult == 'true':
            return make_response(jsonify({"message": "Successful"}), 201)
        return make_response(jsonify({"error": "true", "message": "Invalid format"}), 400)


class UserSetParams(Resource):
    def post(self):
        jsonData = request.get_json(force=True)
        q = user.User().setUserParams(jsonData)
        return make_response(jsonify({"message": "Successful"}), 201)
