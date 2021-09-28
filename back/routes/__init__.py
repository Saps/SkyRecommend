#для отдачи frontend-страниц
from flask import Blueprint
from . import main as m

Routes = Blueprint('routes', __name__,
                   template_folder='templates')

#Routes.add_url_rule('/', '', view_func=m.hello)
Routes.add_url_rule('/main', 'main', view_func=m.main)
#Routes.add_url_rule('/login', 'login', view_func=m.lk)