import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
if(process.env.NODE_ENV !== 'development'){
    window.console.log = () => {};
    window.console.warn = () => {};
}

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
