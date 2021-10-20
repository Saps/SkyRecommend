from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP

Base = declarative_base()

class RSCompCond(Base):
    __tablename__ = 'rs_comp_conds'
    id = Column(Integer, primary_key=True)
    comp_id = Column(Integer)
    date_start = Column(TIMESTAMP)
    date_end = Column(TIMESTAMP)
    d_study = Column(Integer)


