import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { connect } from 'react-redux';

import MainPage from "./openpages/MainPage/MainPage";
import LoginMain from "./closepages/Login/LoginMain";

const App = (props : any) => {

    const { getTechMenuAction } = props;
    useEffect(() => {
        //getTechMenuAction()
    });

    return (
        <Router>
            <Switch>
                {/* Открытые страницы */}
                <Route exact path="/" component={MainPage} />
                <Route exact path="/login" component={LoginMain} />
            </Switch>
        </Router>
    );
}


export default connect()(App);
