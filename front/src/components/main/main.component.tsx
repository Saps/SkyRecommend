import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert, Grid } from '@mui/material';

import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';
import { AdminPageComponent, CompanyFrameComponent } from "~/components";

export const MainComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const user = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState<boolean>();
    const history = useHistory();

    const getUser = async () => {
        if (user.id < 0) {
            try {
                setLoading(true);
                await dispatch(getCurrentUserAction());
                setLoading(false);
            } catch (err) {
                history.replace('/login');
            }
        }
    };

    useEffect(() => {
        getUser();
    }, [dispatch, history]);

    if (user.id < 0 || loading) {
        return (
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                <Alert severity="warning">
                    Информация загружается.
                </Alert>
            </Grid>
        )
    } else if (user.role === 'admin') {
        return <AdminPageComponent />;
    } else {
        return <CompanyFrameComponent />;
    }
};
