
from model import domains
import random

Curr_Mess = {
    'empty_list' : 'К сожалению, предварительный лист выборки не содержит ни одного сервиса!'
}


def effCount(tg_list, res_frame):
    dm = domains.RSDomain()
    dm.initLOV()

    for tg_indx, tg_el in enumerate(tg_list):

        o_len = random.randint(1,100)
       #w?
        alg = {
            'a_name' : 'EffCount: ранжирование по ожидаемой эффективности сервиса',
            'a_message' : 'Предполагаемая эффективность сервиса по шкале (1..100) E = '+str(o_len)
        }
        tg_list[tg_indx]['algos'].append(alg)
        tg_list[tg_indx]['rating'] = (tg_list[tg_indx]['rating']*2 + o_len)/3

