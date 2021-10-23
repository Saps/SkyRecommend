from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains
from api import candapi
from hashlib import md5


class FindServs(Resource):
    def get(self):
        d = domains.RSDomain()
        d.initLOV()
        res = d.getList('ServMatrix')
        res1 = []
        res1.append(res[0])
        res1.append(res[1])
        res1.append(res[3])

        return make_response(jsonify(res1), 200)