import { createStore, applyMiddleware } from 'redux'
import {rootReducer } from "./reducers";
import thunk from 'redux-thunk'
export const BackPath = process.env.REACT_APP_API_URL
export const store = createStore(rootReducer, applyMiddleware(thunk))
export const LocalCalls = process.env.REACT_APP_LOCAL_CALLS
