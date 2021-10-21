from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP
from api import db_session

Base = declarative_base()

class RSDomain(Base):
    __tablename__ = 'rs_domains'
    id = Column(Integer, primary_key=True)
    rus_name = Column(String)
    eng_name = Column(String)
    val_type = Column(String)
    rus_descr = Column(String)

    all_lov = {}
    back_lov = {}
    all_cat = {}

    def initLOV(self):
        sess = db_session()
        vlist = sess.query(RSDomain).all()
        for vlv in vlist:
            self.all_lov[vlv.id] = vlv.rus_name
            self.all_cat[vlv.id] = vlv.val_type
            self.back_lov[vlv.rus_name] = vlv.id

    def getVal(self, num):
        return self.all_lov[num]

    def getId(self, val):
        return self.back_lov[val]

    def getCat(self, num):
        return self.all_cat[num]

    def getList(self, name):
        res = []
        for r in self.all_lov:
            if self.all_cat[r] == name:
                res.append(self.all_lov[r])
        return res