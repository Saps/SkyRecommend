from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, domains, companies
from api import quest_api
from hashlib import md5


class QuestWork(Resource):
    def get(self):
        res1 = quest_api.QuestApi().getQuestList()
        return make_response(jsonify(res1), 200)


    def post(self):
        p2 = request.json
        res1 = quest_api.QuestApi().calculateServs(p2)
        return make_response(jsonify(res1), 200)
