import React from 'react'
import { Router, Route } from 'react-router'
import App from './app.js'

React.render((
  <Router>
    <Route path="/" component={App}>
    </Route>
  </Router>
), document.getElementById("react-root"))
