import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { AuthorizationWrapper } from '~/authorization-wrapper';
import {
    AlgorithmSettingsComponent, CompaniesListComponent, FooterComponent, HeaderComponent, LoginComponent, MainComponent,
} from '~/components';
import { store } from '~/store/store';

import './index.scss';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0458fe'
        },
        secondary: {
            main: '#24314a'
        },
        info: {
            main: '#e1e4f4'
        },
        error: {
            main: '#ff1f55'
        },
        success: {
            main: '#28a745'
        },
        warning: {
            main: '#ffc107'
        },
    },
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route exact path="/login" component={LoginComponent}/>
                    <Fragment>
                        <HeaderComponent />
                        <div className="main-container">
                            <AuthorizationWrapper>
                                <Route exact path="/" component={MainComponent}/>
                                <Route exact path="/algorithm-settings" component={AlgorithmSettingsComponent} />
                                <Route exact path="/companies" component={CompaniesListComponent} />
                            </AuthorizationWrapper>
                        </div>
                        <FooterComponent />
                    </Fragment>
                </Switch>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
