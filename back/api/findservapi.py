from api import db_session
from model import companies, domains
from sqlalchemy import text
import algo

class FindServApi:

    def getFramed(self, comp_data):
        dm = domains.RSDomain()
        dm.initLOV()

        #################################### Thanks to K.!!! #############################################
        n_st = dm.getId(comp_data['frame']['study'])
        n_t = comp_data['frame']['techs']
        n_m = comp_data['frame']['markets']
        n_okv = (comp_data['company'].okved_osn + ';' + comp_data['company'].okved_dop).split(';')
        sql = f"""
            select id, study_d, markets, techs, okveds
            from kip
            where study_d like '%{n_st}%'
        """
        myset = self.performToResult(sql)
        res_framed = []
        for myone in myset:
            if myone.markets != None:
                my_m = myone.markets.split(';')
            else:
                my_m = []
            sl1 = 1.0
            if len(n_m) != 0:
                sl1 = len(set(my_m)&set(n_m))/len(n_m)
            if myone.techs != None:
                my_t = myone.techs.split(';')
            else:
                my_t = []
            sl2 = 1.0
            if len(n_t) != 0:
                sl2 = len(set(my_t)&set(n_t))/len(n_t)
            if myone.okveds != None:
                my_o = myone.okveds.split(';')
            else:
                my_o = []
            sl3 = 1.0
            if len(n_okv) != 0:
                sl3 = len(set(my_o)&set(n_okv))/len(n_okv)
            prox = (1.0-sl1)+(1.0-sl2)+(1.0-sl3)
            n = {
                'id': myone.id,
                'prox' : prox
            }
            res_framed.append(n)
        newlist = sorted(res_framed, key=lambda k: k['prox'])
        add_wh = str(newlist[0]['id'])+','+str(newlist[1]['id'])+','+str(newlist[2]['id'])
        sql2 = f"""
            select c9 from kip
            where id in ({add_wh})
        """
        rt_set = []
        for n1 in self.performToResult(sql2):
            rt_set.append(n1[0])

        sql3 = f"""
            select src,dst,dst2 from recode_kip
            order by 1
        """
        recode_arr = {}
        recode_arr2 = {}
        for n3 in self.performToResult(sql3):
            recode_arr[n3[0]]=n3[1]
            if n3[2]!=None:
                recode_arr2[n3[0]] = n3[2]
        result_list = []
        for n4 in set(rt_set):
            result_list.append(recode_arr[n4])
            if n4 in recode_arr2.keys():
                result_list.append(recode_arr2[n4])
        #################################### Thanks to K.!!! #############################################
        return {'needs':rt_set, 'servs': result_list}


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res