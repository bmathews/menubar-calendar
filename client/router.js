import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router';
import App from './app.js';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
), document.getElementById("react-root"))
