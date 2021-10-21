from api import db_session
from model import companies, domains
from sqlalchemy import text

class CandApi:

    def getAllFrame(self, comp_obj):
        sp = self.getAllCands(comp_obj)
        res = []
        for s in sp:
            rs = {
                "name": s[3],
                "type": s[1],
                "rating": 0
            }
            res.append(rs)
        return res


    def getAllCands(self, comp_obj):
        res_frame = {'props':[]}
        js_res = comp_obj.getProps()
        for j in js_res:
            f = j['params']
            res_frame['props'].extend(f)
        fr_res = comp_obj.getFrame()
        res_frame.update(fr_res)

        dm = domains.RSDomain()
        dm.initLOV()
        res_ids = []
        for id_d in res_frame['techs']:
            res_ids.append(str(dm.getId(id_d)))
        for id_d2 in res_frame['markets']:
            res_ids.append(str(dm.getId(id_d2)))

        dom_ids =  ','.join(res_ids)
        sql = f"""
            select id, serv_type, src_serv_id, serv_name
            from rs_services
            where
                id in (select serv_id from rs_service_doms where dom_id in ({dom_ids}))
        """

        cand_list = self.performToResult(sql)

        return cand_list

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        #result = [dict(row.items()) for row in res]
        #return result
        return res