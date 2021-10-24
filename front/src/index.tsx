import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { store } from '~/store/store';
import {
    CompanyPropertiesComponent, FooterComponent, HeaderComponent,
    LoginComponent, MainComponent, RegisterComponent, ServiceListComponent,
} from './components';

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
                    <Route exact path="/register" component={RegisterComponent}/>
                    <Fragment>
                        <HeaderComponent />
                        <div className="main-container">
                            <Route exact path="/" component={MainComponent}/>
                            <Route exact path="/services" component={ServiceListComponent} />
                        </div>
                        <FooterComponent />
                    </Fragment>
                </Switch>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
