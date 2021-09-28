import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {LoginComponent, MainComponent, NotFoundComponent, RegisterComponent} from './components';
import './index.scss';

export const App = () => {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainComponent} />
          <Route exact path="/login" component={LoginComponent} />
          <Route exact path="/register" component={RegisterComponent} />
          <Route component={NotFoundComponent} />
        </Switch>
      </BrowserRouter>
  );
}
