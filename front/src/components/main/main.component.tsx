import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store/rootReducer';
import { AdminPageComponent, CompanyFrameComponent } from "~/components";

export const MainComponent = (): JSX.Element => {
    const user = useSelector((state: RootState) => state.user);
    return user.role === 'admin' ? <AdminPageComponent /> : <CompanyFrameComponent />;
};
