import { PayloadAction } from '@reduxjs/toolkit';
import { CURRENT_USER, DELETE_CURRENT_USER } from '../actions';
import { FullUserInfo } from '../types';

const initialState = {
    access_token: '',
    email: '',
    id: -1,
    params: null,
    username: '',
    role: '',
};

export const userReducer = (state: FullUserInfo = initialState, action: PayloadAction<FullUserInfo>) => {
    switch (action.type) {
        case CURRENT_USER:
            return { ...action.payload };
        case DELETE_CURRENT_USER:
            return { ...initialState };
        default:
            return state;
    }
}
