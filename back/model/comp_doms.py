from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP

Base = declarative_base()

class RSCompDom(Base):
    __tablename__ = 'rs_comp_doms'
    id = Column(Integer, primary_key=True)
    comp_id = Column(Integer)
    dom_id = Column(Integer)
    #comp_cond_id = Column(Integer)


