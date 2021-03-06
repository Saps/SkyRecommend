# rest-api приложения
from flask import Blueprint
from flask_restful import Api
from . import user, company, domain, algor, findservs, quest

RestApiBP = Blueprint('restapi', __name__,
                      template_folder='templates')
RestApi = Api(RestApiBP)

#---------------- Actual API 1.0

RestApi.add_resource(user.UserLogin, '/user/login')
RestApi.add_resource(user.UserLogout, '/user/logout')
RestApi.add_resource(user.UserCurrent, '/user/current')

#get post
RestApi.add_resource(company.CompanyProps, '/company/props')
#get post
RestApi.add_resource(company.CompanyFrame, '/company/frame')

RestApi.add_resource(domain.DomainServs, '/ref/services')
RestApi.add_resource(domain.DomainMarkets, '/ref/markets')
RestApi.add_resource(domain.DomainTechs, '/ref/techs')
RestApi.add_resource(domain.DomainStudies, '/ref/study')

RestApi.add_resource(algor.AlgorActiveGet, '/candapi/algor')
RestApi.add_resource(algor.AlgorAllGet, '/candapi/algor/all')

RestApi.add_resource(quest.QuestWork, '/quest')
RestApi.add_resource(findservs.FindServs, '/findservs')

#new
RestApi.add_resource(findservs.ListServices, '/listserv')
RestApi.add_resource(findservs.ListServTypes, '/listservtypes')

RestApi.add_resource(algor.TuneAlgor, '/tunealgor')


RestApi.add_resource(findservs.ServTextList, '/servtext')
RestApi.add_resource(findservs.ServCondition, '/servcond')
RestApi.add_resource(findservs.ServGraph, '/servgraph')
RestApi.add_resource(findservs.UpdateRating, '/updater')
