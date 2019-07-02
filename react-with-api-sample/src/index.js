import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Route, Router, browserHistory, } from 'react-router';
import Layout from '../src/components/Layout';
ReactDOM.render(
  <Router history={browserHistory}>
    <Route exact path="/" component={Layout}/>
  </Router>,
  document.getElementById('app')
);
serviceWorker.unregister();