from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP

Base = declarative_base()

class RSPropertyGroup(Base):
    __tablename__ = 'rs_property_groups'
    id = Column(Integer, primary_key=True)
    group_name = Column(String)
    ordernum = Column(Integer)
    is_comp = Column(Integer)


