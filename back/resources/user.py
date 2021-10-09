from schemas import user as sus
from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user
from functools import wraps
from hashlib import md5


class UserLogin(ResFree):
    def post(self):
        jsonData = request.get_json()
        loginResult, logRole = user.User().doLogin(jsonData)
        if loginResult == 'invalid':
            return make_response(jsonify({"error":"true", "message":"Wrong credentials"}), 401)
        if loginResult == 'invalidFormat':
            return make_response(jsonify({"error":"true", "message":"Invalid user name or password entry format"}), 401)

        return make_response(jsonify(access_token=loginResult, user_role=logRole), 200)


class UserLogout(Resource):
    def get(self):
        user.User().doUnLogin()
        return make_response(jsonify({"message":"Successful"}), 202)


class UserCurrent(Resource):
    def get(self):
        q = user.User().userCurrent()
        return make_response(jsonify(q), 201)

