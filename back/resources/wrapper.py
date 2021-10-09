from functools import wraps
from flask_restful import Resource as FRES
from flask import request, make_response, jsonify
import json
from model import user #, userlog
import datetime
from api import IAPI

def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        qstart = datetime.datetime.now()
        #print(request.headers.environ)
        if not("HTTP_AUTHORIZATION" in request.headers.environ):
            return make_response(jsonify(message='No authorization'), 401)
        #    return func(*args, **kwargs)#"No authorization"
        
        re = request.headers.environ['HTTP_AUTHORIZATION']
        rw = re.split(' ')
        if rw[0] != 'Bearer':
            return make_response(jsonify(message='No authorization'), 401)

        us = user.user.checkSession(rw[1])
        if us == None :
            return make_response(jsonify(message='No session'), 401)
        IAPI.US = us
        req = request
        fun = func(*args, **kwargs)
        #ul = userlog.UserLog()
        #ul.addToLog(query_start_time = qstart,
        #            query_type=req.method,
        #            query_address=req.base_url,
        #           query_json=req.json,
        #            resp_json=fun.json,
        #            resp_code=fun.status_code,
        #            resp_message=fun.response
        #            )
        return fun

        #restful.abort(401)
    return wrapper


class Resource(FRES):
    method_decorators = [authenticate]

