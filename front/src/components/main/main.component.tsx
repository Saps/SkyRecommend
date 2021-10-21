import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert, Grid } from '@mui/material';

import { getToken } from '~/api';
import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';
import { AdminPageComponent, ServiceListComponent } from "~/components";

export const MainComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const { id, role } = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState<boolean>();

    const getUser = async () => {
        if (id < 0 && getToken) {
            setLoading(true);
            await dispatch(getCurrentUserAction());
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (id < 0 && !getToken) {
        return <Redirect to="/login" />;
    } else if (loading) {
        return (
            <Grid container item direction="column" p={2} xs={12} sm={10} md={8}>
                <Alert severity="warning">
                    Информация загружается.
                </Alert>
            </Grid>
        )
    } else if (role === 'admin') {
        return <AdminPageComponent />;
    } else {
        return <ServiceListComponent />;
    }
};
