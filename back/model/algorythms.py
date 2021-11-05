from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Float, text
from api import db_session


Base = declarative_base()

class RSAlgo(Base):
    __tablename__ = 'rs_algorythms'
    id = Column(Integer, primary_key=True)
    alg_name = Column(String)
    alg_caption = Column(String)
    ordernum = Column(Integer)
    weight = Column(Float)
    rating = Column(Float)
    alg_descr = Column(String)
    enabled = Column(Integer)


    def getActualList(self):
        sess = db_session()
        vlist = sess.query(RSAlgo).filter(RSAlgo.enabled == 1).order_by(RSAlgo.ordernum).all()
        res = []
        for v in vlist:
            r = {
                "name": v.alg_name,
                "caption": v.alg_caption,
                "weight": v.weight
            }
            res.append(r)
        return res


    def getAlgoList(self):
        sess = db_session()
        vlist = sess.query(RSAlgo).order_by(RSAlgo.ordernum).all()
        res = []
        for v in vlist:
            r = {
                "id" : v.id,
                "name": v.alg_name,
                "caption": v.alg_caption,
                "weight": v.weight,
                "is_enabled": v.enabled
            }
            res.append(r)
        return res


    def setAlgors(self, p2):
        for p in p2:
            sql = f""" update rs_algorythms set enabled = {p['is_enabled']}, weight = {p['weight']}
                       where id = {p['id']} 
                    """
            sqlx = text(sql)
            session = db_session()
            session.execute(sqlx)
        pass