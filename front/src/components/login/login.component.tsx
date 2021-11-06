import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginAction } from '~/store/user/actions';
import { RootState } from '~/store/rootReducer';
import type { CommonResponse } from '~/types';

import './login.component.scss';

export const LoginComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { errors, handleBlur, handleChange, handleSubmit, isValid, touched, values } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Введите логин'),
            password: Yup.string().required('Введите пароль'),
        }),
        onSubmit: async values => {
            try {
                setErrorMessage('');
                await dispatch(loginAction(values));
                history.replace('/');
            } catch (e) {
                const message = (e as CommonResponse).message || 'Произошла неизвестная ошибка!';
                setErrorMessage(message);
            }
        }
    });

    return (
        <Box className="login-page">
            <Paper className="login-page__container" elevation={10}>
                <Avatar sx={{m: 1, backgroundColor: '#ff1f55'}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход в Startup Guide
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        autoComplete="username"
                        error={touched.username && !!errors.username}
                        fullWidth
                        helperText={(touched.username && errors.username) || ''}
                        id="username"
                        label="Логин"
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
                        helperText={(touched.password && errors.password) || ''}
                        label="Пароль"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{mt: 1}}
                        type="password"
                        value={values.password}
                        variant="standard"
                    />
                    <Button disabled={!isValid} type="submit" variant="contained">
                        Войти
                    </Button>
                </Box>
                {errorMessage && (
                    <Box sx={{ pt: 2 }}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};
