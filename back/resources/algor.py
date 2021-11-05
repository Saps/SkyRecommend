from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains, companies, algorythms
from api import candapi
from hashlib import md5


class AlgorActiveGet(Resource):
    def get(self):
        c = companies.RSCompany().findCompany()
        d = candapi.CandApi()
        res = d.getFinalResult(c)
        return make_response(jsonify(res), 200)

# копипаста для тех, кто изучает код
# улыбнитесь! Вас _не_ снимает скрытая камера! :)

class AlgorAllGet(Resource):
    def get(self):
        c = companies.RSCompany().findCompany()
        d = candapi.CandApi()
        res = d.getFinalResult(c, is_all=True)
        return make_response(jsonify(res), 200)


class TuneAlgor(Resource):
    def get(self):
        res1 = algorythms.RSAlgo().getAlgoList()
        return make_response(jsonify(res1), 200)


    def post(self):
        p2 = request.json
        algorythms.RSAlgo().setAlgors(p2)
        return make_response(jsonify('OK'), 200)