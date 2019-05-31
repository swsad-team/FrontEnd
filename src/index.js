import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'


import './index.css'
import WrappedLoginForm from './components/LoginForm'
import WrappedRegistrationForm from './components/RegisterForm'
import HomePage from './components/HomePage'
import { userApi } from './apis'
import { Layout, Menu, Spin, Icon } from 'antd'

import { UserProvider, UserContext } from './context'
import SubMenu from 'antd/lib/menu/SubMenu'

import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
const { Header, Content } = Layout

function App(props) {
  const [loading, setLoading] = useState(false)
  const { login, setLogin } = useContext(UserContext)
  useEffect(() => {
    async function fetchUserInfo() {
      let user = await userApi.getUserInfo()
      if (user) {
        setLogin(true)
      }
      setLoading(true)
    }
    fetchUserInfo()
  }, [])

  let content = (
    <Layout className="layout">
      <Router>
        <Header className="header">
          <div className="logo">
            <span>Earn it</span>
          </div>
          <Menu
            mode="horizontal"
            style={{ lineHeight: '64px', float: 'right' }}
          >
            <SubMenu title={<Icon type="user" />}>
              <Menu.Item key="userInfo">个人信息</Menu.Item>
              <Menu.Item key="logout">退出</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content className="content">
          {loading ? (
            <Switch>
              <Route
                path="/login"
                exact
                component={
                  !login ? WrappedLoginForm : () => <Redirect to="/" />
                }
              />
              <Route
                path="/register"
                exact
                component={
                  !login ? WrappedRegistrationForm : () => <Redirect to="/" />
                }
              />
              <Route
                path="/"
                component={login ? HomePage : () => <Redirect to="/login" />}
              />
            </Switch>
          ) : (
            <div>
              <Spin />
            </div>
          )}
        </Content>
      </Router>
    </Layout>
  )

  return content
}

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <UserProvider>
      <App />
    </UserProvider>
  </LocaleProvider>,
  document.getElementById('root')
)
