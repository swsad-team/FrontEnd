import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

import './index.css'
import WrappedLoginForm from './components/LoginForm'
import WrappedRegistrationForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import { Layout, Menu, } from 'antd';
const {
  Header, Footer, Content,
} = Layout;


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
    //     isLogin: true,
    //   })
    // }, 1000)
  }

  handleLoginSuccess = (history) => {
    this.setState({
      isLogin: true,
    })
    history.push('/')
  }

  handleRegisteSuccess = (history) => {
    history.push('/login')
  }

  render() {
    const LoginForm = withRouter(
      ({ history, location }) => {
        return (
          !this.state.isLogin
            ? (<Content>
              <WrappedLoginForm onLoginSuccess={this.handleLoginSuccess.bind(this, history)} />
            </Content>)
            : <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
        )
      }
    )

    const RegisterForm = withRouter(
      ({ history, location }) => {
        return (
          !this.state.isLogin
            ? (<Content>
              <WrappedRegistrationForm onRegisteSuccess={this.handleRegisteSuccess.bind(this, history)} />
            </Content>)
            : <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
        )
      }
    )
    return (
      <Layout className="layout">
        <Router>
          <Header>
            <div className="logo" ><span>Earn it</span></div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px', float:"right" }}
            >
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Header>
          <PrivateRoute exact path="/" component={HomePage} isLogin={this.state.isLogin} />
          <Route path="/login" render={() => (<LoginForm />)} />
          <Route path="/register" render={() => (<RegisterForm />)} />
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Router>
      </Layout>
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