import { PayloadAction } from '@reduxjs/toolkit';
import { CURRENT_USER } from '~/store/user/actions';
import { UserInfo } from '~/types';

export const initialState = {
    email: '',
    id: -1,
    params: null,
    username: '',
    role: '',
};

export const userReducer = (state: UserInfo = initialState, action: PayloadAction<UserInfo>): UserInfo => {
    switch (action.type) {
        case CURRENT_USER:
            return { ...action.payload };
        default:
            return state;
    }
}
