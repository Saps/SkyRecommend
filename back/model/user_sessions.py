from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP

Base = declarative_base()

class User_Sessions(Base):
    __tablename__ = 'rs_sessions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    sess_id = Column(String)
    last_check = Column(TIMESTAMP)


    def __init__(self, sess_id="", user_id=""):
        self.user_id = user_id
        self.sess_id = sess_id


    def __repr__(self):
        return "<User_Sessions('%s','%s')>" % (self.user_id, self.sess_id)

