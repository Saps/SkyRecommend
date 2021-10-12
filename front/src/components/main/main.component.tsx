import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Link } from '@mui/material';
import { RootState } from '~/store/rootReducer';
import { deleteCurrentUserAction, getCurrentUserAction } from '~/store/user/actions';

import './main.component.scss';

export const MainComponent = (): JSX.Element => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();

    const handleLogout = async () => {
        await dispatch(deleteCurrentUserAction());
    };

    useEffect(() => {
        dispatch(getCurrentUserAction());
    }, []);

    return (
        <div className="page-container">
            <p>Главная страница</p>
            {user.id > 0
            ?
                <div>
                    <div>Вы вошли как {user.username}</div>
                    <Link onClick={handleLogout}>Выйти</Link>
                </div>
            :   <div>
                    <div>Вы неавторизованы</div>
                    <Link href="/login">Войти</Link>
                </div>
            }
        </div>
    );
};
