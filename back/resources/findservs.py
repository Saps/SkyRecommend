from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains, companies, services
from api import candapi, findservapi
from hashlib import md5


class FindServs(Resource):
    def get(self):

        c = companies.RSCompany().findCompany()
        fr = c.getFrame()
        f = findservapi.FindServApi()
        res1 = f.getFramed({'company' : c, 'frame' : fr})

        return make_response(jsonify(res1), 200)


class ListServTypes(Resource):
    def get(self):
        res1 = services.RSService().getServTypes()
        return make_response(jsonify(res1), 200)


class ListServices(Resource):
    def get(self):
        p = request.values
        res1 = services.RSService().getServices(p)
        return make_response(jsonify(res1), 200)