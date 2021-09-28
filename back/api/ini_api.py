import configparser
import json

FILES_INI = ['config.ini']

class INI_API(object):
    config = ''

    def __init__(self):
        self.config = configparser.RawConfigParser()
        self.config.read(FILES_INI)


    def getDBLink(self):
        if not self.config.has_option('OTHERS', 'dblink'):
            return None
        return self.config.get('OTHERS', 'dblink')


IAPI = INI_API()
