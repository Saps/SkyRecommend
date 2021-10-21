from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Float

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

