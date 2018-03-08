import React, { PureComponent, Fragment } from 'react';
import { HashRouter, Route } from 'react-keeper';
import Index from './pages/Home';
import './App.css';

class App extends PureComponent {
  render() {
    return (
      <HashRouter>
        <Fragment>
          <Route index miss cache='parent' component={Index} path="/" />
        </Fragment>
      </HashRouter>
    );
  }
}

export default App;
