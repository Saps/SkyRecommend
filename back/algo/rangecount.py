
Curr_Mess = {
    'empty_list' : 'К сожалению, предварительный лист выборки не содержит ни одного сервиса!'
}


def rangeCount(tg_list, res_frame):
    result = {
        'range' : 5,  # от 0 до 10, 5 - нейтральный
        'message' : ''
    }
    if len(tg_list) == 0:
        result['message'] = Curr_Mess['empty_list']
        return result
    tg_list[0]['rating'] = 1
    #tg_list[1]['rating'] = 2