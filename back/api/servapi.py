from api import db_session
from model import companies, domains, algorythms, services
from sqlalchemy import text
import algo
import pymorphy2
import re, sys, string
import codecs
import csv

EQUAL_PREC = 2

forbid = ['','в','с','и','по','c','или','для','о','на','к','другой','я','от','-','свой','что','\n','это','он','не','но',
          'быть','как','новый','весь','они',' ','же','есть','кто','а','вот','так','у','тут','уже','такой','где','там','вы','мы',
          'если','этот','какой','сейчас','да','тоже','только','но','можно','из','ещё','то','за','ну','очень','наш','тот','ты','ир','\\','/','\r',
          'при','всё','нет']

class ServApi:

    #################################### Thanks to K.!!! #############################################
    def getServCond(self, srv_id):
        morph = pymorphy2.MorphAnalyzer()
        sql = f"""select rus_name from rs_domains where val_type in ('Techs','Market') """
        res = self.performToResult(sql)
        all_list = []
        for r in res:
            hz = r[0].strip(string.punctuation).replace('«', '').replace('»', '').split(' ')
            for h in hz:
                all_list.append(morph.parse(h)[0].normal_form)

        sql2 = f"""select d.rus_name from
                    rs_domains d, rs_service_doms sd
                    where sd.dom_id = d.id
                    and d.val_type in ('Techs','Market')
                    and sd.serv_id = {srv_id}
            """
        need_list = []
        res2 = self.performToResult(sql2)
        for r2 in res2:
            hz = r2[0].strip(string.punctuation).replace('«', '').replace('»', '').split(' ')
            for h in hz:
                need_list.append(morph.parse(h)[0].normal_form)

        all_str = ''
        mx = services.RSService().getTextList(srv_id)
        for m in mx:
            all_str = all_str + m

        str_mass = all_str.strip(string.punctuation).replace('«','').replace('»','').split(' ')
        w_right = 0
        w_all = 0
        for sw in str_mass:
            sw2 = morph.parse(sw)[0].normal_form
            if sw2 in need_list:
                w_right = w_right + 1
                w_all = w_all + 1
                continue
            if sw2 in all_list:
                w_all = w_all + 1
        mess = ''
        if w_all != 0:
            resul = float(w_right) / float(w_all)
            mess = 'Релевантность упоминаний в тексте: '+ str(resul) + \
                '. Рекомендуемый рейтинг формального соответствия: ' + str(int(resul*100))
        else:
            mess = 'Релевантных упоминаний в набранном материале нет, необходимо пополнить текстовый корпус'

        fr = services.RSService().getFormalRating(srv_id)
        a = {
            "message" : mess,
            "rating" : fr
        }
        return a


    def getCannon(self, srv_id):
        morph = pymorphy2.MorphAnalyzer()
        all_str = ''
        mx = services.RSService().getTextList(srv_id)
        for m in mx:
            all_str = all_str + m
        res_list = {}
        res_matrix = {}

        str_p = self.safeSplit(all_str)

        for str_c in str_p:
            str_con = str_c.strip(string.punctuation).replace('«', '').replace('»', '')
            mass = str_con.split(' ')
            mass2 = []
            for m in mass:
                rs = morph.parse(m)[0].normal_form
                if rs in res_list.keys():
                    res_list[rs] = res_list[rs] + 1
                else:
                    res_list[rs] = 1

                if rs not in mass2:
                    mass2.append(rs)

            for m1 in mass2:
                for m2 in mass2:
                    if m1 > m2:
                        iss = m2
                        sch = m1
                    else:
                        iss = m1
                        sch = m2
                    if iss == sch:
                        continue
                    if iss not in res_matrix.keys():
                        res_matrix[iss] = {}
                    if sch not in res_matrix[iss].keys():
                        res_matrix[iss][sch] = 1
                    else:
                        res_matrix[iss][sch] = res_matrix[iss][sch] + 1

        NODE_TH = 2
        LINK_TH = 1
        PAIR_TH = 1

        nnod = 0
        nlin = 0

        for v in forbid:
            res_list.pop(v, None)

        newnames = {}

        for k1, v1 in res_matrix.items():
            for k2, v2 in res_matrix[k1].items():
                if k1 not in res_list:
                    continue
                if k2 not in res_list:
                    continue
                if v2 >= PAIR_TH:
                    if self.my_equal(v2, res_list[k1]):
                        newnames[k1] = k1 + '+' + k2
                    if self.my_equal(v2, res_list[k2]):
                        newnames[k2] = k1 + '+' + k2

        n_nodes = []
        n_edges = []

        for key, val in res_list.items():
            if key in forbid: continue
            if key not in newnames.keys():
                continue
            if val > NODE_TH:
                new_nd = {
                    "id" : key,
                }
                if key in newnames.keys():
                    new_nd["size"] : 5 + val / NODE_TH
                    new_nd["caption"] = newnames[key]
                    new_nd["color"] = "green"
                else:
                    new_nd["size"]: val / NODE_TH
                    new_nd["caption"] = key
                    new_nd["color"] = "blue"
                n_nodes.append(new_nd)

        for k1, v1 in res_matrix.items():
            if k1 not in res_list.keys():
                continue
            if k1 not in newnames.keys():
                continue
            if res_list[k1] <= NODE_TH: continue
            if k1 in forbid: continue
            for k2, v2 in res_matrix[k1].items():
                if k2 not in res_list.keys():
                    continue
                if k2 not in newnames.keys():
                    continue
                if res_list[k2] <= NODE_TH: continue
                if k2 in forbid: continue
                if v2 > LINK_TH:
                    new_ed = {
                        "id" : str(k1)+'_'+str(k2),
                        "from": k1,
                        "to": k2,
                        "weight" : v2
                    }
                    n_edges.append(new_ed)
        pass
        a = {
            "nodes" : n_nodes,
            "edges" : n_edges
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


    def safeSplit(self, text):
        re1 = re.compile("""
        (?:
            (?:
                (?<!\\d(?:р|г|к))
                (?<!и\\.т\\.(?:д|п))
                (?<!и(?=\\.т\\.(?:д|п)\\.))
                (?<!и\\.т(?=\\.(?:д|п)\\.))
                (?<!руб|коп)
            \\.) |
            [!?\\n]
        )+
        """, re.X)
        res = []
        sear = re1.search(text)
        while sear:
            res.append(text[:sear.end()].replace('\n',''))
            text = text[sear.end():]
            sear = re1.search(text)
        res.append(text)
        return res

    def my_equal(self, first, second):
        if first == second:
            return True
        if first > second and first <= second + EQUAL_PREC:
            return True
        if first < second and first + EQUAL_PREC >= second:
            return True
        return False