import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';

import { Box, Button, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';

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
                onClick={toogleSidebar(false)}
                onKeyDown={toogleSidebar( false)}
            >
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts', 'All mail', 'Trash', 'Spam'].map((text: string, index: number) => (
                        <ListItem button key={text}>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    const toogleSidebar = (isOpen: boolean) => (event: any) => {
        if (event.type === 'keydown' && ['Shift', 'Tab'].includes(event.key)) {
            return;
        }
        setSidebarOpen(isOpen);
    };

    const handleLogout = async () => {
        await dispatch(logoutAction());

        history.push('/login');
    };

    return (
        <header>
            <AppBar>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toogleSidebar(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Top
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
                </Toolbar>
            </AppBar>
            <h1>Top</h1>
            <Fragment key="sidebar">
                <Button onClick={toogleSidebar(true)}>Open sidebar</Button>
                <Drawer
                    anchor="left"
                    open={sidebarOpen}
                    onClose={toogleSidebar(false)}
                >
                    {renderSidebar()}
                </Drawer>
            </Fragment>
        </header>
    )
}
