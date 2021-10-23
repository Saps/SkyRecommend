import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { IconButton, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';

import { RootState } from '~/store/rootReducer';
import { logoutAction } from '~/store/user/actions';

import './header.component.scss';

export const HeaderComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);

    const handleLogout = async () => {
        await dispatch(logoutAction());
        history.replace('/login');
    };

    return (
        <>
            <header className="app-header">
                <ReactSVG className="app-header__logo-wrapper" src="logotype.svg" />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Startup Guide
                </Typography>
                <Typography variant="body1" component="div">
                    {user.username}
                </Typography>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="logout"
                    aria-controls="topbar-menu"
                    aria-haspopup="true"
                    onClick={handleLogout}
                    color="inherit"
                >
                    <Logout fontSize="small" />
                </IconButton>
            </header>
        </>
    )
}
