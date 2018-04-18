import React, { PureComponent } from 'react';
import { HashRouter, Route, Control } from 'react-keeper';
import { message } from 'antd';
import Index from './pages/Home';
import User from './pages/User';
import Publish from './pages/User/publish';
import './App.css';

const timeOut = 60 * 30 * 1000;

class Roots extends PureComponent {
  render() {
    return this.props.children;
  }
}

class App extends PureComponent {
  state = {
    loginState: false
  }
  login = (loginState,type) => {
    this.setState({ loginState })
    if (loginState) {
      if(type===0){
        Control.replace('/publish');
      }else{
        Control.replace('/index');
      }
    } else {
      Control.replace('/login');
    }
  }

  loginFilter = (callback, props) => {
    const { loginState } = this.state;
    if (!loginState && Control.path !== '/login') {
      message.info('请先登录!');
      this.login(false);
    } else {
      callback()
    }
  }

  visibilitychange = () => {
    if(document.hidden){
      window.localStorage.setItem('userLastRecord',new Date().valueOf());
    }else{
      const { loginState } = this.state;
      const now = new Date().valueOf();
      const userLastRecord = window.localStorage.getItem('userLastRecord')||now;
      if(now-userLastRecord>=timeOut&&loginState){
        message.warning('登录超时，请重新登录!');
        setTimeout(() => {
          this.login(false);
        }, 1000);
        window.localStorage.removeItem('userLastRecord');
      }
    }
  }

  componentDidMount() {
    document.addEventListener('visibilitychange', this.visibilitychange, false)
  }

  render() {
    return (
      <HashRouter>
        <Route path="/" index component={Roots} enterFilter={this.loginFilter}>
          <Route miss component={User} path="/login" login={this.login} />
          <Route component={Index} path="/index" />
          <Route component={Publish} path="/publish" />
        </Route>
      </HashRouter>
    );
  }
}

export default App;
