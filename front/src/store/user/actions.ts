import { UserInfo, UserCredentials } from '~/types';
import { login, currentUser } from '~/api';

import { AppDispatch } from '../store';

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
        const loginResult = await login(credentials);
        const userInfo = await currentUser();
        return dispatch(currentUserAction({ ...userInfo }));
    };
}

export const currentUserAction = (info: UserInfo) => ({
    type: CURRENT_USER,
    payload: info,
});

export const deleteCurrentUserAction = () => ({
   type: DELETE_CURRENT_USER,
   payload: {},
});
