from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON
from flask import session
import uuid
from api import db_session
from . import user_sessions
from schemas import user as u1
from flask import current_app as ap1
import datetime, uuid
from hashlib import md5
from api import IAPI


Base = declarative_base()


class User(Base):
    __tablename__ = 'rs_users'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    email = Column(String)
    params = Column(JSON)
    role = Column(String)
    comp_id = Column(Integer)

    dmp = u1.SUser()

    def __init__(self, username="", password="",
                 security="", email=""):
        self.username = username
        self.password = password
        self.email = email


    def doLogin(self, jsonData):
        sess = db_session()
        try:
            usname = jsonData['username']
            paword = jsonData['password']
        except KeyError:
            return 'invalidFormat', ''
        #mdpass = md5(paword.encode('utf-8')).hexdigest()
        mdpass = paword
        our_user = sess.query(User).filter((User.username == usname) & (User.password == mdpass)).first()
        if not our_user:
            return 'invalid', ''

        sess.flush()
        sql = "delete from rs_sessions where user_id = :us_id"
        db_session().execute(sql, {'us_id': our_user.id, })

        sess_uid = str(uuid.uuid4())
        user_session = user_sessions.User_Sessions()
        user_session.user_id = our_user.id
        user_session.sess_id = sess_uid
        user_session.last_check = datetime.datetime.now()
        sess.add(user_session)
        sess.flush()
        return sess_uid, our_user.role

    def doUnLogin(self):
        m = IAPI.US
        s = db_session()
        s.delete(m)
        s.flush()


    def userCurrent(self):
        m2 = self.userCurrObj()
        return m2.dmp.dump(m2)


    def userCurrObj(self):
        sess = db_session()
        m = IAPI.US
        m2 = sess.query(User).filter((User.id == m.user_id)).first()
        return m2


    def checkSession(self, token):
        sess = db_session()
        user_session = sess.query(user_sessions.User_Sessions).filter_by(sess_id=token).first()
        if user_session:
            if user_session.last_check < datetime.datetime.now() - datetime.timedelta(days=5):
                sql = "delete from rs_sessions where sess_id = :sess_id"
                db_session().execute(sql, {'sess_id': user_session.sess_id, })
                sess.flush()
                return None
            user_session.last_check = datetime.datetime.now()
            sess.flush()
            return user_session
        return None


    def __repr__(self):
        return "<User_Registration('%s)>" \
               % (self.username)


user = User()
