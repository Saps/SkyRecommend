from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, JSON
from flask import session
from api import StoredObject
import uuid
from api import db_session
from api import IAPI
from . import user_sessions
from schemas import user as u1
from flask_mail import Message, Mail
from flask import current_app as ap1
import datetime, uuid
from hashlib import md5

def send_email(subject, sender, recipients, text_body, html_body):
    MMail = Mail(ap1)
    msg = Message(subject, sender = sender, recipients = recipients)
    msg.body = text_body
    msg.html = html_body
    MMail.send(msg)


Base = declarative_base()

class User(Base, StoredObject):
    __tablename__ = 'nv_users'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    security = Column(String)
    email = Column(String)
    reg_uid = Column(String)
    recov_uid = Column(String)
    recov_time = Column(TIMESTAMP)
    params = Column(JSON)

    dmp = u1.SUser()

    def __init__(self, username="", password="",
                 security="", email=""):
        self.username = username
        self.password = password
        self.security = security
        self.email = email


    def doRegisterUser(self, jsonData):
        sess = db_session()

        try:
            username = jsonData['username']
            password = jsonData['password']

            if (username is None or password is None) or (username == "" or password == ""): # какаято фигня, надо переделать
                return "missing arguments"
            checkUserName = sess.query(User).filter(User.username == username).first()
            if not checkUserName:
                user_reg = User()
                user_reg.username = username
                user_reg.password = md5(password.encode('utf-8')).hexdigest()
                user_reg.security = jsonData['security']
                user_reg.email = jsonData['email']
        except KeyError:
            return 'invalidFormat'

            sess.add(user_reg)
            sess.flush()
            return "true"
        else:
            return "exists"


    def doLogin(self, jsonData):
        sess = db_session()
        try:
            usname = jsonData['username']
            paword = jsonData['password']
        except KeyError:
            return 'invalidFormat'
        mdpass = md5(paword.encode('utf-8')).hexdigest()
        our_user = sess.query(User).filter((User.username == usname) & (User.password == mdpass)).first()
        if not our_user:
            return 'invalid'
        if our_user.reg_uid!='' and our_user.reg_uid!=None:
            return 'unconfirmed'

        our_user.recov_id = None
        sess.flush()
        sql = "delete from nv_sessions where user_id = :us_id"
        db_session().execute(sql, {'us_id': our_user.id, })

        sess_uid = str(uuid.uuid4())
        user_session = user_sessions.User_Sessions()
        user_session.user_id = our_user.id
        user_session.sess_id = sess_uid
        user_session.last_check = datetime.datetime.now()
        sess.add(user_session)
        sess.flush()
        return sess_uid


    def doUserСhangeData(self, newData):
        s = db_session()
        gData = s.query(User).filter_by(id=IAPI.US.user_id).first()
        try:
            gData.email = newData['email']
        except KeyError:
            return 'invalidFormat'
        session.update()
        s.flush()
        return None

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

    def getUserById(self, us_id):
        sess = db_session()
        m2 = sess.query(User).filter((User.id == us_id)).first()
        return m2

    def checkSession(self, token):
        sess = db_session()
        user_session = sess.query(user_sessions.User_Sessions).filter_by(sess_id=token).first()
        if user_session:
            if user_session.last_check < datetime.datetime.now() - datetime.timedelta(days=5):
                sql = "delete from nv_sessions where sess_id = :sess_id"
                db_session().execute(sql, {'sess_id': user_session.sess_id, })
                sess.flush()
                return None
            user_session.last_check = datetime.datetime.now()
            sess.flush()
            return user_session
        return None

    #if checkUserName.recov_time > datetime.datetime.now() - datetime.timedelta(minutes=2):
    #    return 'true'  # prevent flood

    def doChangePassword(self, user_id, newPass):
        sess = db_session()
        m = sess.query(User).filter_by(id=user_id).first()
        m.password = md5(newPass.encode('utf-8')).hexdigest()
        m.recov_uid = None
        m.recov_time = None
        sess.flush()


    def doSendingMail(self, usermail):
        ADMINS = ['sapegin@sc.vsu.ru']

        sess = db_session()
        checkUserName = sess.query(User).filter(User.email == usermail).first()
        if checkUserName:
            if checkUserName.recov_time > datetime.datetime.now() - datetime.timedelta(minutes=2):
                return 403, 'Already sent sometimes ago'
            if checkUserName.reg_uid != None:
                return 403, 'Email not confirmed yet'
            checkUserName.recov_uid = str(uuid.uuid4())
            checkUserName.recov_time = datetime.datetime.now()
            sess.flush()
            r = send_email('Hello world', sender=ADMINS[0], recipients=[usermail],
                       text_body='Hello',
                       html_body = ('<h1> Its my uid = %s </h1> my id = %s')%(checkUserName.recov_uid, checkUserName.id))
            return 200, 'Email sent'
        return 404, 'User not found'


    def doApproveMail(self, usermail):
        ADMINS = ['sapegin@sc.vsu.ru']

        sess = db_session()
        checkUserName = sess.query(User).filter(User.email == usermail).first()
        if checkUserName:
            checkUserName.reg_uid = str(uuid.uuid4())
            sess.flush()
            r = send_email('Hello world', sender=ADMINS[0], recipients=[usermail],
                       text_body='Hello',
                       html_body = ('<h1> Its my reg_uid = %s </h1>')%(checkUserName.reg_uid))
            return 200, 'Email sent'
        return 404, 'User not found'


    def isEmailPresent(self, email):
        sess = db_session()
        checkUserName = sess.query(User).filter(User.email == email).first()
        if checkUserName:
            return True
        return False

    def isUsernamePresent(self, uname):
        sess = db_session()
        checkUserName = sess.query(User).filter(User.username == uname).first()
        if checkUserName:
            return True
        return False


    def doVerifyEmail(self, usertoken):
        sess = db_session()
        try:
            m = sess.query(User).filter_by(reg_uid=usertoken).first()
        except Exception as ex:
            return 'invalidFormatToken'
        if m != None:
            m.reg_uid = None
            sess.flush()
            return 'true'
        else:
            return 'didnt accepted'


    def setUserParams(self, params):
        sess = db_session()
        m = IAPI.US
        m2 = sess.query(User).filter((User.id == m.user_id)).first()
        m2.params = params
        sess.flush()
        return True


    def __repr__(self):
        return "<User_Registration('%s)>" \
               % (self.username)


user = User()
