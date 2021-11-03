from api import db_session
from model import companies, domains, algorythms
from sqlalchemy import text
import algo

class CandApi:

    frameset = []
    res_frame = {}

    def getFinalResult(self, comp_obj, is_all=False):

        # сначала выбираем рамочный сет
        self.frameset = self.getAllFrame(comp_obj, is_all)

        algors = algorythms.RSAlgo().getActualList()

        for fname in algors:
            f = getattr(algo, fname['name'])
            f(self.frameset, self.res_frame, fname['caption'], fname['weight'])

        for fx, fz in enumerate(self.frameset):
            del self.frameset[fx]['ids']

        newlist = sorted(self.frameset, key=lambda k: -k['rating'])

        return newlist[:6]


####################################### Формирование запроса и выборка рамочного фрейма
    def getAllFrame(self, comp_obj, is_all):
        sp = self.getAllCands(comp_obj, is_all)
        res = []
        for s in sp:
            rs = {
                "name": s[3],
                "type": s[1],
                "rating": 0,
                "ids" : s[4],
                "algos" : []
            }
            res.append(rs)
        return res


    def getAllCands(self, comp_obj, is_all):
        self.res_frame = {'props':[]}
        js_res = comp_obj.getProps()
        for j in js_res:
            f = j['params']
            self.res_frame['props'].extend(f)
        fr_res = comp_obj.getFrame()
        self.res_frame.update(fr_res)

        dm = domains.RSDomain()
        dm.initLOV()
        res_tech_ids = []
        res_mark_ids = []
        #res_srvs_ids = []
        for id_d in self.res_frame['techs']:
            res_tech_ids.append(str(dm.getId(id_d)))
        for id_d2 in self.res_frame['markets']:
            res_mark_ids.append(str(dm.getId(id_d2)))
        #for id_d3 in self.res_frame['srvs']:
        #    res_srvs_ids.append(str(dm.getId(id_d3)))

        dom_study = comp_obj.d_study
        dom_tech_ids =  ','.join(res_tech_ids)
        if len(dom_tech_ids) < 1:
            dom_tech_ids = '0'
        dom_mark_ids = ','.join(res_mark_ids)
        if len(dom_mark_ids) < 1:
            dom_mark_ids = '0'
        #dom_srvs_ids = ','.join(res_srvs_ids)
        add_act = ' and rs.is_active = 1'
        if is_all:
            add_act = ''

        sql = f"""
            select rs.id, rs.serv_type, rs.src_serv_id, rs.serv_name,
            (select string_agg(cast(r1.dom_id as text), ',') from rs_service_doms r1
                where r1.serv_id = rs.id
                group by r1.serv_id) as retids
            from rs_services rs
            where
                rs.id in (select serv_id from rs_service_doms where dom_id = {dom_study}) and
                rs.id in (select serv_id from rs_service_doms where dom_id in ({dom_tech_ids})) and 
                rs.id in (select serv_id from rs_service_doms where dom_id in ({dom_mark_ids}))  
                {add_act}
        """
        cand_list = self.performToResult(sql)
        return cand_list


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res