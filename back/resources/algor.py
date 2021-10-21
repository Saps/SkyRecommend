from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains, companies
from api import candapi
from hashlib import md5


class AlgorGet(Resource):
    def get(self):
        c = companies.RSCompany().findCompany()
        d = candapi.CandApi()
        res = d.getAllFrame(c)
        return make_response(jsonify(res), 200)


