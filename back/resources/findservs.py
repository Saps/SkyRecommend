from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains, companies
from api import candapi, findservapi
from hashlib import md5


class FindServs(Resource):
    def get(self):

        c = companies.RSCompany().findCompany()
        fr = c.getFrame()
        f = findservapi.FindServApi()
        res1 = f.getFramed({'company' : c, 'frame' : fr})

        return make_response(jsonify(res1), 200)