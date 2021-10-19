from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON

Base = declarative_base()

class RSProperty(Base):
    __tablename__ = 'rs_properties'
    id = Column(Integer, primary_key=True)
    visual_name = Column(String)
    pg_id = Column(Integer)
    lov = Column(JSON)
    ordernum = Column(Integer)


