from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


def db_connect():
    return Mydb.connect

def db_session():
    return Mydb.bdsession

def db_engine():
    return Mydb.engine

class Db:
    def __init__(self):
        self.cstring = 'postgresql://recsys:recsys@185.221.152.242/postgres'
        self.engine = create_engine(self.cstring)
        self.bdsession = sessionmaker(bind=self.engine)()
        self.connect = self.engine.connect()

Mydb = Db()




