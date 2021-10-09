import React, { Fragment, useState } from 'react';
import { Mail, MoveToInbox } from '@mui/icons-material';
import { Box, Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import './header.component.scss';

export const HeaderComponent = (): JSX.Element => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const renderSidebar = (): JSX.Element => {
        return (
            <Box
                sx={{width: 250}}
                role="presentation"
                onClick={toogleSidebar(false)}
                onKeyDown={toogleSidebar( false)}
            >
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text: string, index: number) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 < 1 ? <MoveToInbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text: string, index: number) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 < 1 ? <MoveToInbox /> : <Mail />}
                            </ListItemIcon>
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

    return (
        <header>
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
