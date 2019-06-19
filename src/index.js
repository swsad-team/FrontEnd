import './index.css'
import 'moment/locale/zh-cn'

import { Icon, Layout, Menu, Spin } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  Link
} from 'react-router-dom'
import { UserContext, UserProvider } from './context'

import { LocaleProvider } from 'antd'
import ReactDOM from 'react-dom'
import SubMenu from 'antd/lib/menu/SubMenu'
import WrappedLoginForm from './components/LoginForm'
import WrappedRegistrationForm from './components/RegisterForm'
import moment from 'moment'
import { userApi } from './apis'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import HomePage from './components/HomePage'

moment.locale('zh-cn')
const { Header, Content } = Layout

function App(props) {
  const [loading, setLoading] = useState(false)
  const { login, setLogin } = useContext(UserContext)
  useEffect(() => {
    async function fetchUserInfo() {
      let user = await userApi.getUserInfo()
      console.log(user)
      if (user) {
        // setLogin(true)
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
            <Menu.Item>
              <Link to="/tasks/new">发布任务</Link>
            </Menu.Item>
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
