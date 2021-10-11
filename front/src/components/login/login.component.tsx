import React from 'react';
import { useDispatch } from 'react-redux';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {LockOutlined} from '@mui/icons-material';
import {Avatar, Box, Button, Link, Paper, TextField, Typography} from '@mui/material';
import {currentUser, login} from '../../api';
import {currentUserAction} from '../../actions';
import './login.component.scss';

export const LoginComponent = (): JSX.Element => {
    const dispatch = useDispatch();

    const {errors, handleBlur, handleChange, handleSubmit, touched, values} = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: values => {
            login(values)
                .then(async res => {
                    const userInfo = await currentUser();
                    dispatch(currentUserAction(userInfo));
                })
                .catch(err => alert(err.message));
        }
    });

    return (
        <Box className="login-page">
            <Paper className="login-page__container" elevation={10}>
                <Avatar sx={{m: 1, bgcolor: '#9c27b0'}}>
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
                <span>
                    Don't have an account?&nbsp;<Link href="/register">Sign up</Link>
                </span>
            </Paper>
        </Box>
    );
};
