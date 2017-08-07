/* eslint flowtype-errors/show-errors: 0 */

// TODO: Fix router to new paths
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './src/App';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={App} />
    </Switch>
  </App>
);
