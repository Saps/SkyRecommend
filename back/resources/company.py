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
            return make_response(jsonify({"Message" : cmp}), 409)
        js_res = cmp.getProps()

        return make_response(jsonify(js_res), 200)

    def post(self):
        p2 = request.json
        cmp = companies.RSCompany().findCompany()
        cmp.eatParams(p2['changed_params'])
        return make_response(jsonify({"Message" : "OK"}), 200)


class CompanyFrame(Resource):
    def get(self):
        cmp = companies.RSCompany().findCompany()
        if not isinstance(cmp, companies.RSCompany):
            return make_response(jsonify({"Message": cmp}), 409)
        cf = cmp.getFrame()
        return make_response(jsonify(cf), 200)


    def post(self):
        p2 = request.json
        cmp = companies.RSCompany().findCompany()
        cmp.eatFrame(p2)
        return make_response(jsonify({"Message" : "OK"}), 200)



