from api import db_session
from model import companies, domains, algorythms
from sqlalchemy import text
import algo

class ServApi:

    def getServCond(self, srv_id):
        a = {
            "message" : "Результат работы алгоритма - bla bla bla",
            "rating" : "58"
        }
        return a


    def getCannon(self, srv_id):
        a = {
            "nodes" : [
                {
                    "id" : 1,
                    "caption" : "Еда",
                    "color" : "red"
                },
                {
                    "id" : 2,
                    "caption" : "Питье",
                    "color" : "blue"
                }
            ],
            "edges" : [
                {
                    "id": 3,
                    "from": 1,
                    "to": 2
                }
            ]
        }

        return a


    def updateRating(self, srv_id, rtg):
        sql = f"""update rs_services set formal_rating = {str(rtg)} where id = {srv_id} """
        sqlx = text(sql)
        session = db_session()
        session.execute(sqlx)


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res