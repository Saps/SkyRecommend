from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains
from api import candapi
from hashlib import md5


class DomainServs(Resource):
    def get(self):
        d = domains.RSDomain()
        d.initLOV()
        res = d.getList('ServMatrix')
        return make_response(jsonify(res), 200)


class DomainMarkets(Resource):
    def get(self):
        d = domains.RSDomain()
        d.initLOV()
        res = d.getList('Market')
        return make_response(jsonify(res), 200)


class DomainTechs(Resource):
    def get(self):
        d = domains.RSDomain()
        d.initLOV()
        res = d.getList('Techs')
        return make_response(jsonify(res), 200)


class DomainStudies(Resource):
    def get(self):
        d = domains.RSDomain()
        d.initLOV()
        res = d.getList('Study')
        return make_response(jsonify(res), 200)
