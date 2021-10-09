import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {LockOutlined} from '@mui/icons-material';
import {Avatar, Box, Button, Checkbox, FormControlLabel, Link, Paper, TextField, Typography} from '@mui/material';
import './login.component.scss';

export const LoginComponent = (): JSX.Element => {
    const {errors, handleBlur, handleChange, handleSubmit, touched, values} = useFormik({
        initialValues: {
            login: '',
            password: '',
            remember: false,
        },
        validationSchema: Yup.object({
            login: Yup.string().required('Login is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
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
                        autoComplete="login"
                        error={touched.login && !!errors.login}
                        fullWidth
                        helperText={touched.login && !!errors.login ? errors.login : ''}
                        id="login"
                        label="Login"
                        name="login"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        sx={{mt: 1}}
                        value={values.login}
                        variant="standard"
                    />
                    <TextField
                        autoComplete="current-password"
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
                    <FormControlLabel
                        control={<Checkbox color="primary" id="remember" value="remember"/>}
                        label="Remember me"
                        onChange={handleChange}
                    />
                    <Button disabled={!!errors.login || !!errors.password} type="submit" variant="contained">
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
