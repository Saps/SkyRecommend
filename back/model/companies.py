from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP
from api import IAPI
from api import db_session
from . import properties, property_groups, user, comp_prop_values, domains, comp_doms

Base = declarative_base()

class RSCompany(Base):
    __tablename__ = 'rs_companies'
    id = Column(Integer, primary_key=True)
    inn = Column(String)
    cname = Column(String)
    d_study = Column(Integer)
    okved_osn = Column(String)
    okved_dop = Column(String)


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
                else:
                    continue
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

        res_frame['study'] = dom_spr.getVal(self.d_study)

        res_frame['company_name'] = self.cname
        res_frame['inn'] = self.inn
        res_frame['okved_osn'] = self.okved_osn
        res_frame['okved_dop'] = self.okved_dop

        res_frame['techs'] = []
        res_frame['markets'] = []
        res_frame['srvs'] = []
        curr_tms = sess.query(comp_doms.RSCompDom).filter(comp_doms.RSCompDom.comp_id == self.id) \
                   .order_by(comp_doms.RSCompDom.dom_id).all()
        for tms in curr_tms:
            dm = dom_spr.getCat(tms.dom_id)
            if dm == 'Market':
                res_frame['markets'].append(dom_spr.getVal(tms.dom_id))
            if dm == 'Techs':
                res_frame['techs'].append(dom_spr.getVal(tms.dom_id))
            if dm == 'ServMatrix':
                res_frame['srvs'].append(dom_spr.getVal(tms.dom_id))

        return res_frame

    def eatParams(self, pars):
        entries = []
        sess = db_session()
        for pr in pars:
            e = sess.query(comp_prop_values.RSCompPropValue).get(pr['id'])
            e.value = pr['value']
            entries.append(e)

        sess.add_all(entries)
        sess.flush()


    def eatFrame(self, frame):
        res_frame = {}
        sess = db_session()

        dom_spr = domains.RSDomain()
        dom_spr.initLOV()


        self.d_study =  dom_spr.getId(frame['study'])
        if 'company_name' in frame.keys():
            self.cname = frame['company_name']
        if 'inn' in frame.keys():
            self.inn = frame['inn']
        if 'okved_osn' in frame.keys():
            self.okved_osn = frame['okved_osn']
        if 'okved_dop' in frame.keys():
            self.okved_dop = frame['okdev_dop']
        sess.add(self)
        sess.flush()

        alldoms = frame['markets']
        alldoms.extend(frame['techs'])
        alldoms.extend(frame['srvs'])

        ad = []
        for a in alldoms:
            ad.append(dom_spr.getId(a))

        sess.query(comp_doms.RSCompDom).filter(comp_doms.RSCompDom.dom_id.notin_(ad)).delete()
        sess.flush()
        curr_tms = sess.query(comp_doms.RSCompDom).filter(comp_doms.RSCompDom.comp_id == self.id) \
            .order_by(comp_doms.RSCompDom.dom_id).all()
        for t in curr_tms:
            ad.remove(t.dom_id)
        to_ins = []
        for a in ad:
            e = comp_doms.RSCompDom()
            e.comp_id = self.id
            e.dom_id = a
            to_ins.append(e)

        sess.add_all(to_ins)
        sess.flush()


