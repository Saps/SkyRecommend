import React, { PropsWithChildren, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert, Grid } from '@mui/material';
import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';

export const AuthorizationWrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const user = useSelector((state: RootState) => state.user);
    const [checked, setChecked] = useState(false);

    const getUser = useCallback(async () => {
        if (!checked) {
            try {
                await dispatch(getCurrentUserAction());
            } catch (err) {
            } finally {
                setChecked(true);
            }
        }
    }, [checked, dispatch]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    return (
        !checked ? (
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                <Alert severity="warning">
                    Проверка авторизации...
                </Alert>
            </Grid>
        ) : user.id < 0 ? (
            <Redirect to="/login" />
        ) : (
            <>{children}</>
        )
    );

};
