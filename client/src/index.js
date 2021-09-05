import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Index from './components/index';
import Home from './components/home';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={props => <Index {...props} />} />
      <Route path="/register" exact render={props => <Index {...props} />} />
      <Route path="/home" exact render={props => <Home {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

