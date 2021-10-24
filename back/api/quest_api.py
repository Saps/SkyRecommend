from api import db_session
from model import companies, domains
from sqlalchemy import text
import algo
import json

class QuestApi:

    def getQuestList(self):
        sql = f"""
            select question
            from rs_quest
            order by ordernum
        """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append(i[0])
        return result_list


    def calculateServs(self, json_in):
        sql = f"""
            select question, balls
            from rs_quest
        """
        res1_set = {}
        myset = self.performToResult(sql)
        for m in myset:
            wset = m[1]
            for ws in wset:
                if ws not in res1_set.keys():
                    res1_set[ws] = 0
                if m[0] in json_in.keys():
                    res1_set[ws] = res1_set[ws] + json_in[m[0]]*wset[ws]
        result = []
        for r in res1_set:
            if res1_set[r]>1.0:
                result.append(r)
        return result


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res