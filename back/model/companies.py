from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP
from api import IAPI
from api import db_session
from . import properties, property_groups, user, comp_prop_values

Base = declarative_base()

class RSCompany(Base):
    __tablename__ = 'rs_companies'
    id = Column(Integer, primary_key=True)
    inn = Column(String)
    cname = Column(String)


    def getProps(self):
        sess = db_session()

        uc = user.User().userCurrObj()
        cmp_main = sess.query(RSCompany).filter(RSCompany.id == uc.comp_id).first()
        if cmp_main is None:
            return 'Company for current user is not found'
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
                vl = sess.query(comp_prop_values.RSCompPropValue).filter(comp_prop_values.RSCompPropValue.comp_id == uc.comp_id) \
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
