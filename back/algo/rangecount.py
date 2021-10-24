
from model import domains

Curr_Mess = {
    'empty_list' : 'К сожалению, предварительный лист выборки не содержит ни одного сервиса!'
}


def rangeCount(tg_list, res_frame):
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
            'a_name' : 'RangeCount: алгоритм ранжирования по близости свойств',
            'a_message' : 'Вычислена симметричная близость свойств нужд компании и партнера, она равна '+str(o_len)
        }
        tg_list[tg_indx]['algos'].append(alg)
        tg_list[tg_indx]['rating'] = round(100*o_len)

