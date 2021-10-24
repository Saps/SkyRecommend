import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Redirect, useHistory } from 'react-router-dom';
import { loginAction } from '~/store/user/actions';
import { RootState } from '~/store/rootReducer';
import { CommonError } from '~/types';

import './login.component.scss';

export const LoginComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const { errors, handleBlur, handleChange, handleSubmit, touched, values } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async values => {
            try {
                await dispatch(loginAction(values));
                history.replace('/');
            } catch (e) {
                alert((e as CommonError).message);
            }
        }
    });

    if (user.id > -1) {
        return <Redirect to="/" />
    }

    return (
        <Box className="login-page">
            <Paper className="login-page__container" elevation={10}>
                <Avatar sx={{m: 1, bgcolor: '#ff1f55'}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        autoComplete="username"
                        error={touched.username && !!errors.username}
                        fullWidth
                        helperText={touched.username && !!errors.username ? errors.username : ''}
                        id="username"
                        label="Username"
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{mt: 1}}
                        value={values.username}
                        variant="standard"
                    />
                    <TextField
                        autoComplete="password"
                        error={touched.password && !!errors.password}
                        id="password"
                        fullWidth
                        helperText={touched.password && !!errors.password ? errors.password : ''}
                        label="Password"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{mt: 1}}
                        type="password"
                        value={values.password}
                        variant="standard"
                    />
                    <Button disabled={!!errors.username || !!errors.password} type="submit" variant="contained">
                        Sign In
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};
