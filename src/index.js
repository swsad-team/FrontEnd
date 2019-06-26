import './index.css'
import 'moment/locale/zh-cn'

import { Icon, Layout, Menu, Spin, message } from 'antd'
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

const App = () => {
  const [loading, setLoading] = useState(true)
  const { login, setLogin, setUserInfo } = useContext(UserContext)
  useEffect(() => {
    let isSubscribe = true
    async function fetchUserInfo() {
      let response = await userApi.getUserInfo()
      if (isSubscribe) {
        if (response.errorMessage) {
          message.error(response.errorMessage)
        } else {
          if ('uid' in response) {
            setLogin(true)
            setUserInfo(response)
          }
        }
        setLoading(false)
      }
    }
    fetchUserInfo()
    return () => {
      isSubscribe = false
    }
  }, [])

  const handleSignOut = async () => {
    const response = await userApi.signOutUser()
    if (response) {
      setLogin(false)
    }
  }
  const handleDailyCheck = async () => {
    const { errorMessage } = await userApi.check()
    if (errorMessage) {
      message.error(errorMessage)
    } else {
      message.success(`每日签到 金币 +50`)
    }
  }
  let content = (
    <Layout className="layout">
      <Router>
        <Header className="header">
          <div className="logo">
            <Link to="/">
              <span>Earn it</span>
            </Link>
          </div>
          {login && (
            <Menu
              mode="horizontal"
              style={{ lineHeight: '64px', float: 'right' }}
            >
              <Menu.Item>
                <Link to="/tasks/new">发布任务</Link>
              </Menu.Item>
              <SubMenu title={<Icon type="user" />}>
                <Menu.Item key="userInfo">
                  <Link to="/user">个人信息</Link>
                </Menu.Item>
                <Menu.Item key="check" onClick={handleDailyCheck}>
                  每日签到
                </Menu.Item>
                <Menu.Item key="logout" onClick={handleSignOut}>
                  退出
                </Menu.Item>
              </SubMenu>
            </Menu>
          )}
        </Header>
        <Content className="content">
          {!loading ? (
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
