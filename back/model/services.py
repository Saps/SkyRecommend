from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Float, text
from api import db_session


Base = declarative_base()

class RSService(Base):
    __tablename__ = 'rs_services'
    id = Column(Integer, primary_key=True)
    serv_type = Column(String)
    src_serv_id = Column(Integer)
    serv_name = Column(String)
    is_active = Column(Integer)
    eff_rating = Column(Float)
    formal_rating = Column(Float)


    def getServices(self, p):
        add1 = ''
        if 'type' in p.keys():
            add1 = ' and serv_type = \''+p['type']+'\''
        add2 = ''
        if 'search' in p.keys():
            add2 = ' and serv_name like \'%' + p['search'] + '%\''
        add3 = ''
        if 'offset' in p.keys():
            add3 = ' offset ' + p['offset']
        add4 = ''
        if 'limit' in p.keys():
            add4 = ' limit ' + p['limit']

        sql = f"""
                    select id, serv_type, serv_name, eff_rating, formal_rating
                    from rs_services
                    where 1 =1 {add1} {add2}
                    order by serv_name
                    {add3} {add4}
                """
        myset = self.performToResult(sql)
        resset = []
        for m in myset:
            resset.append({'id':m[0],'serv_type':m[1],'serv_name':m[2], 'eff_rating':m[3], 'formal_rating':m[4]})
        sql2 = f"""
                    select *
                    from rs_services
                    where 1 =1 {add1} {add2}
                """
        myset2 = self.performToResult(sql2)
        return {'total':len(myset2), 'result':resset}

    def getServTypes(self):
        sql = f"""
                select distinct serv_type
                from rs_services
                order by 1
                """
        myset = self.performToResult(sql)
        resset = []
        for m in myset:
            resset.append(m[0])
        return resset


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res