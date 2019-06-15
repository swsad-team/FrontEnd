import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { Checkbox, Select, Row, Col } from 'antd'
import './HomePage.css'
import TaskList from './TaskList'
import TaskModal from './TaskModal'
import NewTaskPage from './NewTask'

const { Option } = Select

const CheckAllBox = props => {
  const { checkedList, setCheckedList, options, withCheckAll = false } = props

  const indeterminate =
    !!checkedList.length && checkedList.length < options.length
  const checkAll = checkedList.length === options.length

  const handleChange = checkedList => {
    setCheckedList(checkedList)
  }

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? options : [])
  }

  return (
    <>
      {withCheckAll && (
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      )}
      <Checkbox.Group
        options={options}
        value={checkedList}
        onChange={handleChange}
      />
    </>
  )
}

const TaskListController = props => {
  const roleOptions = ['我的', '组织', '个人']
  const defaultRoleList = ['我的']
  const [roleList, setRoleList] = useState(defaultRoleList)
  const [taskModal, setTaskModal] = useState({ visible: false, task: null })
  let taskList = []
  for (let i = 0; i < 10; i++) {
    taskList.push({
      id: i,
      title: `task---${i}`,
      content: `this is a example content`,
      reward: (i % 5) + 1
    })
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <CheckAllBox
            checkedList={roleList}
            setCheckedList={setRoleList}
            options={roleOptions}
            withCheckAll={true}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Select defaultValue="latest-all">
            <Option value="latest-all">显示全部</Option>
            <Option value="latest-day">最近一天</Option>
            <Option value="latest-weeky">最近一周</Option>
            <Option value="latest-month">最近一月</Option>
          </Select>
        </Col>
      </Row>
      <TaskList taskList={taskList} setTaskModal={setTaskModal} />
      {taskModal.visible && (
        <TaskModal
          task={taskModal.task}
          visible={taskModal.visible}
          setTaskModal={setTaskModal}
        />
      )}
    </>
  )
}

const HomePage = props => {
  const { match } = props
  console.log(`${match.url}/newTask`)
  return (
    <div className="home-page">
      <Route path="/newTask" component={NewTaskPage} />
      <Route exact path={match.path} component={TaskListController} />
    </div>
  )
}

export default HomePage
