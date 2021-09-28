from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from api.ini_api import IAPI


def db_connect():
    return db.connect

def db_session():
    return db.bdsession

def db_engine():
    return db.engine

class Db(object):
    def __init__(self):

        self.engine = create_engine(IAPI.getDBLink())
        self.bdsession= sessionmaker(bind=self.engine, autocommit=True)()
        self.connect = self.engine.connect()

db = Db()





