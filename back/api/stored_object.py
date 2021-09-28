from . import db_connect, db_session
from flask import request, jsonify
from api import IAPI
from sqlalchemy import text as sqtext
import math
import datetime

class StoredObject():

    # перегружаемо
    def get_one(self, id):
        s = db_session()
        result = s.query(type(self)).filter_by(id=id).first()
        return result

    def get_list_of(self, wh = '', ob = ''):
        s = db_session()
        l1 = s.query(type(self))
        if wh != '':
            l1 = l1.filter(wh)
        if ob != '':
            l1 = l1.order_by(ob)
        l = list(l1.all())
        ll2 = []
        for row in l:
            ll2.append(row.__dict__)

        return self.dump_set_of_objects(ll2)

    def dump_object(self):
        if hasattr(self, 'dmp'):
            self.dmp.many = False
            return self.dmp.dump(self)
        return jsonify('Dumping error')

    def dump_set_of_objects(self, list):
        if hasattr(self, 'dmp'):
            self.dmp.many=True
            return self.dmp.dump(list)
        return jsonify('Dumping error')

############################### REST Methods
    def post(self, id = ''):
        s = db_session()
        if (id != ''):
            res = s.query(type(self)).filter_by(id = id).first()
            if res == None:
                return
        else :
            res = self
            s.add(res)
        p2 = request.json
        for keyz, param in p2.items():
            if keyz == 'id': continue
            nkey = keyz
            if hasattr(res, 'dmp'):
                if keyz not in res.dmp.fields:
                    continue
                if res.dmp.fields[keyz].attribute:
                    nkey = res.dmp.fields[keyz].attribute
            res.__setattr__(nkey, param)
        #s.commit()
        s.flush()
        res2 = res.dump_object()
        return res2

    def delete(self, id=''):
        s = db_session()
        res = s.query(type(self)).filter_by(id=id).first()
        if not res :
            return '!'
        s.delete(res)
        s.flush()

    def saveself(self):
        s = db_session()
        s.flush()
