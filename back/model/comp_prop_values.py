from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP

Base = declarative_base()

class RSCompPropValue(Base):
    __tablename__ = 'rs_comp_prop_values'
    id = Column(Integer, primary_key=True)
    comp_id = Column(Integer)
    prop_id = Column(Integer)
    value = Column(String)


