
from model import domains


def rangeCount(tg_list, res_frame, a_name, a_weight):
    dm = domains.RSDomain()
    dm.initLOV()

    com_arr = []
    for t in res_frame['techs']:
        com_arr.append(str(dm.getId(t)))
    for m in res_frame['markets']:
        com_arr.append(str(dm.getId(m)))
    for s in res_frame['srvs']:
        com_arr.append(str(dm.getId(s)))

    for tg_indx, tg_el in enumerate(tg_list):

        ids_arr = tg_el['ids'].split(',')
        o_len = len(set(ids_arr) & set(com_arr)) / (len(ids_arr) + len(com_arr))
        #w?
        alg = {
            'a_name' : a_name,
            'a_message' : 'Вычислена симметричная близость свойств нужд компании и партнера, s = '+str(o_len)
        }
        tg_list[tg_indx]['algos'].append(alg)
        tg_list[tg_indx]['rating'].append({'val':round(100*o_len),'weight':a_weight})

