import { FullUserInfo } from '../types';

export const CURRENT_USER = 'CURRENT_USER';
export const DELETE_CURRENT_USER = 'DELETE_CURRENT_USER';

export const currentUserAction = (info: FullUserInfo) => ({
    type: CURRENT_USER,
    payload: info,
});

export const deleteCurrentUserAction = () => ({
   type: DELETE_CURRENT_USER,
   payload: {},
});
