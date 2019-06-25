import './HomePage.css'

import { Icon, Layout, Menu } from 'antd'
import {
  MyTaskList_Join,
  MyTaskList_Over,
  MyTaskList_Publish
} from './MyTaskList'
import { NavLink, Route, Switch } from 'react-router-dom'

import AllTaskList from './AllTaskList'
import React from 'react'
import NewTaskPage from './NewTask'
import FillSurveyPage from './FillSurveyPage'
import TaskInfo from './TaskInfo'

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
              <Menu.Item key="5">
                <NavLink to="/tasks/user/publish">我发布的</NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink to="/tasks/user/join">我参与的</NavLink>
              </Menu.Item>
              <Menu.Item key="7">
                <NavLink to="/tasks/user/over">已结束</NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content className="home-page-content">
          <div>
            <Switch>
              <Route path="/tasks/new" component={NewTaskPage} />
              <Route path="/tasks/:tid/survey" component={FillSurveyPage} />
              <Route path="/tasks/:tid/info" component={TaskInfo} />
              <Route path="/tasks/all" component={AllTaskList} />
              <Route path="/tasks/user/join" component={MyTaskList_Join} />
              <Route path="/tasks/user/finish" component={MyTaskList_Over} />
              <Route
                path="/tasks/user/publish"
                component={MyTaskList_Publish}
              />
              <Route path="/tasks/:tid" component={MyTaskList_Publish} />

              <Route path="/" component={AllTaskList} />
            </Switch>
          </div>
        </Content>
      </Layout>
    )
  }
}

export default HomePage
