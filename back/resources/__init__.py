# rest-api приложения
from flask import Blueprint
from flask_restful import Api
from . import user, company

RestApiBP = Blueprint('restapi', __name__,
                      template_folder='templates')
RestApi = Api(RestApiBP)

#---------------- Actual API 1.0

RestApi.add_resource(user.UserLogin, '/user/login')
RestApi.add_resource(user.UserLogout, '/user/logout')
RestApi.add_resource(user.UserCurrent, '/user/current')

RestApi.add_resource(company.CompanyProps, '/company/props')




