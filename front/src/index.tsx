import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import {LoginComponent, MainComponent, NotFoundComponent, RegisterComponent} from './components';
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
                <Route exact path="/" component={MainComponent}/>
                <Route exact path="/login" component={LoginComponent}/>
                <Route exact path="/register" component={RegisterComponent}/>
                <Route component={NotFoundComponent}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
