import { FullUserInfo, UserCredentials } from '~/types';
import { login, currentUser } from '~/api';

import { AppDispatch } from '../store';

export const CURRENT_USER = 'CURRENT_USER';
export const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER';

export const loginAction = (credentials: UserCredentials) => {
    return async (dispatch: AppDispatch) => {
        const loginResult = await login(credentials);
        const userInfo = await currentUser(loginResult.access_token);

        return dispatch(currentUserAction({ ...userInfo, access_token: loginResult.access_token }));
    };
}

export const currentUserAction = (info: FullUserInfo) => ({
    type: CURRENT_USER,
    payload: info,
});

export const deleteCurrentUserAction = () => ({
   type: DELETE_CURRENT_USER,
   payload: {},
});
