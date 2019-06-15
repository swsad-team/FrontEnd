import './HomePage.css'

import { Icon, Layout, Menu } from 'antd'
import { NavLink, Route, Switch } from 'react-router-dom'

import AllTaskList from './AllTaskList'
import React from 'react'

const { Sider, Content } = Layout

const { SubMenu } = Menu

class HomePage extends React.Component {
  render() {
    return (
      <Layout className="home-page-section">
        <Sider collapsible width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">
              <NavLink to="/tasks/all">
                <Icon type="appstore" />
                <span>所有任务</span>
              </NavLink>
            </Menu.Item>
            <SubMenu
              key="sub2"
              title={
                <NavLink to="/">
                  <span>
                    <Icon type="user" />
                    <span>我的任务</span>
                  </span>
                </NavLink>
              }
            >
              <Menu.Item key="5">我发布的</Menu.Item>
              <Menu.Item key="6">我参与的</Menu.Item>
              <Menu.Item key="7">已结束</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content className="home-page-content">
          <div>
            <Switch>
              <Route path="/" component={AllTaskList} />
              <Route path="/tasks/all" component={AllTaskList} />
            </Switch>
          </div>
        </Content>
      </Layout>
    )
  }
}

export default HomePage
