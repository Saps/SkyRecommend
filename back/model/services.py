from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Float
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


    def getServices(self):
        pass