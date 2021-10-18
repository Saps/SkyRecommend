import { UserInfo, UserCredentials } from '~/types';
import { login, logout, currentUser } from '~/api';

import { AppDispatch } from '../store';
import { PayloadAction } from '@reduxjs/toolkit';

export const CURRENT_USER = 'CURRENT_USER';
export const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER';

export const getCurrentUserAction = () => {
    return async (dispatch: AppDispatch) => {
        const userInfo = await currentUser();

        return dispatch(currentUserAction({ ...userInfo }));
    };
}

export const loginAction = (credentials: UserCredentials) => {
    return async (dispatch: AppDispatch) => {
        await login(credentials);
        const userInfo = await currentUser();

        return dispatch(currentUserAction({ ...userInfo }));
    };
}

export const logoutAction = () => {
    return async (dispatch: AppDispatch) => {
        await logout();
        const userInfo: UserInfo = await currentUser();

        return dispatch(deleteCurrentUserAction(userInfo));
    };
}

export const currentUserAction = (info: UserInfo): PayloadAction<UserInfo> => ({
    type: CURRENT_USER,
    payload: info,
});

export const deleteCurrentUserAction = (info: UserInfo): PayloadAction<UserInfo> => ({
   type: DELETE_CURRENT_USER,
   payload: info,
});
