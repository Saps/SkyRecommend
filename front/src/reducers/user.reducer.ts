import { PayloadAction } from '@reduxjs/toolkit';
import { CURRENT_USER, DELETE_CURRENT_USER } from '../actions';
import { UserInfo } from '../types';

const initialState = {
    email: '',
    id: -1,
    params: null,
    username: '',
    role: '',
};

export const userReducer = (state: UserInfo = initialState, action: PayloadAction<UserInfo>) => {
    switch (action.type) {
        case CURRENT_USER:
            return { ...action.payload };
        case DELETE_CURRENT_USER:
            return { ...initialState };
        default:
            return state;
    }
}
