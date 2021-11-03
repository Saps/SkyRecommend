import { combineReducers } from 'redux';
import { userReducer } from '~/store/user/reducer';

export const rootReducer = combineReducers({
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
