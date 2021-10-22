import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';

import { Box, Drawer, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Logout, Menu } from '@mui/icons-material';

import { RootState } from '~/store/rootReducer';
import { logoutAction } from '~/store/user/actions';

import './header.component.scss';

export const HeaderComponent = (): JSX.Element => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();

    const renderSidebar = (): JSX.Element => {
        return (
            <Box
                sx={{width: 250}}
                role="presentation"
                onClick={toggleSidebar(false)}
                onKeyDown={toggleSidebar( false)}
            >
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts', 'All mail'].map(text => (
                        <ListItem button key={text}>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    const toggleSidebar = (isOpen: boolean) => (event: any) => {
        if (event.type === 'keydown' && ['Shift', 'Tab'].includes(event.key)) {
            return;
        }
        setSidebarOpen(isOpen);
    };

    const handleLogout = async () => {
        await dispatch(logoutAction());
        history.replace('/login');
    };

    return (
        <>
            <header className="app-header">
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleSidebar(true)}
                >
                    <Menu />
                </IconButton>
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
            <Fragment key="sidebar">
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={toggleSidebar(false)}
                >
                    {renderSidebar()}
                </Drawer>
            </Fragment>
        </>
    )
}
