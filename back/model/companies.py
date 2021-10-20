from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP
from api import IAPI
from api import db_session
from . import properties, property_groups, user, comp_prop_values, comp_conds, domains, comp_doms

Base = declarative_base()

class RSCompany(Base):
    __tablename__ = 'rs_companies'
    id = Column(Integer, primary_key=True)
    inn = Column(String)
    cname = Column(String)


    def findCompany(self):
        sess = db_session()
        uc = user.User().userCurrObj()
        cmp_main = sess.query(RSCompany).filter(RSCompany.id == uc.comp_id).first()
        if cmp_main is None:
            return 'Company for current user is not found'
        return cmp_main


    def getProps(self):
        sess = db_session()
        pgrs = list(sess.query(property_groups.RSPropertyGroup).filter(property_groups.RSPropertyGroup.is_comp == 1) \
                    .order_by(property_groups.RSPropertyGroup.ordernum).all())
        p_result = []
        for pgr_now in pgrs:
            newp = {
                'group_name' : pgr_now.group_name,
                'params' : []
            }

            props = list(sess.query(properties.RSProperty).filter(properties.RSProperty.pg_id == pgr_now.id) \
                    .order_by(properties.RSProperty.ordernum).all())

            for curr_prop in props:
                vl = sess.query(comp_prop_values.RSCompPropValue).filter(comp_prop_values.RSCompPropValue.comp_id == self.id) \
                .filter(comp_prop_values.RSCompPropValue.prop_id == curr_prop.id).first()
                vall = None
                vaid = None
                if vl:
                    vall = vl.value
                    vaid = vl.id
                par = {
                    'id' : vaid,
                    'name' : curr_prop.visual_name,
                    'value' : vall,
                    'list_of_values' : curr_prop.lov
                }
                newp['params'].append(par)

            p_result.append(newp)
        return p_result


    def getFrame(self):
        res_frame = {}
        sess = db_session()

        dom_spr = domains.RSDomain()
        dom_spr.initLOV()

        curr_cond = sess.query(comp_conds.RSCompCond).filter(comp_conds.RSCompCond.date_end == None) \
                    .filter(comp_conds.RSCompCond.comp_id == self.id).first()
        if curr_cond == None:
            return 'No data about condition'
        res_frame['study'] = dom_spr.getVal(curr_cond.d_study)

        curr_servs = sess.query(comp_doms.RSCompDom).filter(comp_doms.RSCompDom.comp_cond_id == curr_cond.id) \
                     .order_by(comp_doms.RSCompDom.dom_id).all()
        res_frame['srvs'] = []
        for cs in curr_servs:
            res_frame['srvs'].append(dom_spr.getVal(cs.dom_id))

        res_frame['techs'] = []
        res_frame['markets'] = []
        curr_tms = sess.query(comp_doms.RSCompDom).filter(comp_doms.RSCompDom.comp_id == self.id) \
                   .order_by(comp_doms.RSCompDom.dom_id).all()
        for tms in curr_tms:
            dm = dom_spr.getCat(tms.dom_id)
            if dm == 'Market':
                res_frame['markets'].append(dom_spr.getVal(tms.dom_id))
            if dm == 'Techs':
                res_frame['techs'].append(dom_spr.getVal(tms.dom_id))

        return res_frame
