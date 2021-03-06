import random
from model import domains

def formalCount(tg_list, res_frame, a_name, a_weight):
    dm = domains.RSDomain()
    dm.initLOV()

    for tg_indx, tg_el in enumerate(tg_list):
        o_len = random.randint(1, 100)
            # w?
        alg = {
                'a_name': 'FormalCount: ранжирование по ожидаемому формальному соответствию сервиса',
                'a_message': 'Предполагаемое соответствие сервиса по шкале (1..100) E = ' + str(o_len)
            }
        tg_list[tg_indx]['algos'].append(alg)
        tg_list[tg_indx]['ratings'].append({'val':round(100*o_len),'weight':a_weight})
