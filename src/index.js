import React from 'react';
import ReactDOM from 'react-dom';

import WrappedLoginForm from './components/LoginForm'


function AppContainer() {
  return (
    <WrappedLoginForm />
  )
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));