import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

import { RootState } from '~/store/rootReducer';
import { deleteCurrentUserAction } from '~/store/user/actions';

import './main.component.scss';

export const MainComponent = (): JSX.Element => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();

    const handleLogout = async () => {
        await dispatch(deleteCurrentUserAction());
    };

    const handleLogin = () => {
        history.push('/login');
    };

    return (
        <div className="page-container">
            <p>Главная страница</p>
            {user.id > 0
            ?
                <div>
                    <div>Вы вошли как {user.username}</div>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            :   <div>
                    <div>Вы неавторизованы</div>
                <button onClick={handleLogin}>Войти</button>
        </div>
            }
        </div>
    );
};
