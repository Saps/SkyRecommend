import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import {FooterComponent, HeaderComponent, LoginComponent, MainComponent, RegisterComponent, SidebarComponent} from './components';
import {rootReducer} from './reducers';
import thunk from 'redux-thunk';
import './index.scss';

export const BackPath = process.env.REACT_APP_API_URL;
export const store = createStore(rootReducer, applyMiddleware(thunk));
export const LocalCalls = process.env.REACT_APP_LOCAL_CALLS;

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={LoginComponent}/>
                <Route exact path="/register" component={RegisterComponent}/>
                <Fragment>
                    <HeaderComponent />
                    <div className="main-container">
                        <Route path="/" component={MainComponent}/>
                    </div>
                    <FooterComponent />
                </Fragment>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
