import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {App} from './App';
import {rootReducer} from './reducers';
import thunk from 'redux-thunk';
import './index.scss';

export const BackPath = process.env.REACT_APP_API_URL;
export const store = createStore(rootReducer, applyMiddleware(thunk));
export const LocalCalls = process.env.REACT_APP_LOCAL_CALLS;

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
