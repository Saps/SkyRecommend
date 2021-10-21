import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { getToken } from '~/api';
import { RootState } from '~/store/rootReducer';
import { getCurrentUserAction } from '~/store/user/actions';
import { AdminPageComponent, ServiceListComponent } from "~/components";

export const MainComponent = (): JSX.Element => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const { id, role } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (id < 0 && getToken) {
            dispatch(getCurrentUserAction());
        }
    }, []);

    if (id < 0 && !getToken) {
        return <Redirect to="/login" />;
    } else if (role === 'admin') {
        return <AdminPageComponent />;
    } else {
        return <ServiceListComponent />;
    }
};
