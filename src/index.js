import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

import WrappedLoginForm from './components/LoginForm'
import HomePage from "./components/HomePage";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
    }
    this.updateUserState()
  }

  updateUserState = () => {
    // setTimeout(() => {
    //   this.setState({
    //     isLogin: false,
    //   })
    // }, 1000)
  }

  handleLoginSuccess = (history) => {
    this.setState({
      isLogin: true,
    })
    history.push('/')
  }

  render() {
    const LoginForm = withRouter(
      ({ history }) => {
        return (<WrappedLoginForm onLoginSuccess={this.handleLoginSuccess.bind(this, history)} />)
      }
    )
    return (
      <Router>
        <h1>App</h1>
        <PrivateRoute exact path="/" component={HomePage} isLogin={this.state.isLogin}/>
        <Route path="/login" render={()=> (<LoginForm />)} />
      </Router>
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        rest.isLogin ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

ReactDOM.render((
  <App />
), document.getElementById('root'))