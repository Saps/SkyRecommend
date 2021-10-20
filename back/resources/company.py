from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, companies
from api import candapi
from hashlib import md5


class CompanyProps(Resource):
    def get(self):
        cmp = companies.RSCompany().findCompany()
        if not isinstance(cmp, companies.RSCompany):
            return make_response(jsonify({"Message" : cmp}), 200)
        js_res = cmp.getProps()

        return make_response(jsonify(js_res), 200)


class CompanyFrame(Resource):
    def get(self):
        cmp = companies.RSCompany().findCompany()
        if not isinstance(cmp, companies.RSCompany):
            return make_response(jsonify({"Message": cmp}), 200)
        cf = cmp.getFrame()
        return make_response(jsonify(cf), 200)
