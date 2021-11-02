import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

import { RootState } from '~/store/rootReducer';
import { logoutAction } from '~/store/user/actions';

import './header.component.scss';

const adminMenuItems = [
    {
        id: 'menu-item-main',
        value: 'Основная страница',
    },
    {
        id: 'menu-item-logout',
        value: 'Выйти из системы',
    },
];

const userMenuItems = [
    {
        id: 'menu-item-main',
        value: 'Основная страница',
    },
    {
        id: 'menu-item-companies',
        value: 'Подбор партнеров',
    },
    {
        id: 'menu-item-logout',
        value: 'Выйти из системы',
    },
];

export const HeaderComponent = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        const { id } = event.currentTarget;
        if (id === 'menu-item-main') {
            history.replace('/');
        } else if (id === 'menu-item-companies') {
            history.replace('/companies');
        } else if (id === 'menu-item-logout') {
            handleLogout();
        }
    };

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
                    aria-label="more"
                    id="long-button"
                    aria-controls="long-menu"
                    aria-expanded={!!anchorEl}
                    aria-haspopup="true"
                    onClick={handleClickMenu}
                  >
                    <MoreVert />
               </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{ 'aria-labelledby': 'long-button' }}
                        anchorEl={anchorEl}
                        open={!!anchorEl}
                        onClose={handleCloseMenu}
                    >
                    {(user.role === 'admin' ? adminMenuItems : userMenuItems).map(option => (
                        <MenuItem id={option.id} key={option.id} onClick={handleCloseMenu}>
                            {option.value}
                        </MenuItem>
                    ))}
                </Menu>
            </header>
        </>
    )
}
