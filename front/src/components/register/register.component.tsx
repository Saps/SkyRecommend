import React from 'react';
import {Avatar, Box, Link, Paper, Typography} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";

export const RegisterComponent = () => {
    return (
        <Box className="login-page">
            <Paper className="login-page__container" elevation={10}>
                <Avatar sx={{ m: 1, bgcolor: '#9c27b0' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <span>
                    Already signed up?&nbsp;<Link href="/login">Login</Link>
                </span>
            </Paper>
        </Box>
    );
};
