import React from 'react';
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

const menuItems = [
    {
        id: 'menu-item-main',
        value: 'Основная страница',
    },
    {
        id: 'menu-item-services',
        value: 'Подобрать сервисы',
    },
    {
        id: 'menu-item-logout',
        value: 'Выйти из системы',
    },
]

export const HeaderComponent = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleCloseMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        const { id } = event.currentTarget;
        if (id === 'menu-item-main') {
            history.push('/');
        } else if (id === 'menu-item-services') {
            history.push('/services');
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
                    aria-expanded={!!anchorEl ? 'true' : undefined}
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
                    {menuItems.map(option => (
                        <MenuItem id={option.id} key={option.id} onClick={handleCloseMenu}>
                            {option.value}
                        </MenuItem>
                    ))}
                </Menu>
            </header>
        </>
    )
}
