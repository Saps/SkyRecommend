# rest-api приложения
from flask import Blueprint
from flask_restful import Api
from . import user
from . import request
from . import image
from . import lov
from . import agency


RestApiBP = Blueprint('restapi', __name__,
                      template_folder='templates')
RestApi = Api(RestApiBP)


#---------------- Actual API 1.0

RestApi.add_resource(user.UserLogin, '/user/login')
RestApi.add_resource(user.UserLogout, '/user/logout')


#RestApi.add_resource(user.UserCurrent, '/user/current')
#RestApi.add_resource(user.UserList, '/user')
# get post
#RestApi.add_resource(user.User, '/user/<int:us_id>')
# get post delete
#RestApi.add_resource(user.ForgotPassword, '/user/forgottenpass')

#---------------------------
#старый функционал с токеном, новый - через post user/id
#RestApi.add_resource(user.SendingResetPasswordMail, '/user/sendmail/<string:username>')
#RestApi.add_resource(user.ChangePasswordViaToken, '/user/recovery/<string:usertoken>')

RestApi.add_resource(user.ApplyMailByToken, '/user/checklink/<string:usertoken>')
RestApi.add_resource(user.UserSetParams, '/user/setparams')

# new api
RestApi.add_resource(request.ResRequest, '/request')

RestApi.add_resource(lov.ResLov, '/lov/<string:alist>')
RestApi.add_resource(image.ResImage, '/image/<int:pp_id>')



RestApi.add_resource(request.ResMember, '/people/<int:pp_id>')
# get post, without delete
#--------------------------------------------------
#fillpeople
RestApi.add_resource(request.PeopleAdd, '/people')
#post

# Проектирование
RestApi.add_resource(agency.AgencyList, '/agency')
# get post
RestApi.add_resource(agency.Agency, '/agency/<int:us_id>')
# get post
# перенести логгер
# схемы для контроля запросов


