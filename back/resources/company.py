from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, companies
from functools import wraps
from hashlib import md5


class CompanyProps(Resource):
    def get(self):
        js_res = companies.RSCompany().getProps()
        if not isinstance(js_res, dict):
            return make_response(jsonify({"Message" : js_res}), 401)
        return make_response(jsonify(js_res), 200)

