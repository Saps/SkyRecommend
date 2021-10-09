import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HeaderComponent, LoginComponent, MainComponent, NotFoundComponent, RegisterComponent} from './components';

export const AppComponent = (props: any) => {
    console.log(props);
    return (
        <div>
            {/^(login|register)$/.test(props.location?.pathname) ? null : <HeaderComponent />}
            <Switch>
                <Route exact path="/" component={MainComponent}/>
                <Route exact path="/login" component={LoginComponent}/>
                <Route exact path="/register" component={RegisterComponent}/>
                <Route component={NotFoundComponent}/>
            </Switch>
        </div>
    );
};
