import React, { useState } from 'react'
import { List, Statistic, Icon } from 'antd'
import moment from 'moment'

const { Countdown } = Statistic

const TaskOutStanding = props => {
  const { time, reward } = props
  const [format, setFormat] = useState(
    moment() > moment(time, 'YYYY-MM-DD HH:mm')
      ? '任务已结束'
      : moment().add(30, 'months') > moment(time, 'YYYY-MM-DD HH:mm')
      ? 'D 天 H 时 m 分'
      : 'M 月 D 天 H 时 m 分'
  )

  const onFinish = () => {
    setFormat('任务已结束')
  }
  return (
    <div>
      <Countdown
        value={moment(time, 'YYYY-MM-DD HH:mm')}
        format={format}
        prefix={<Icon type="clock-circle" />}
        onFinish={onFinish}
      />
      <div className="ant-statistic-content">
        <Icon type="gold" /> {`${reward}金币`}
      </div>
      <div className="ant-statistic-content">
        <Icon type="team" /> {`1/10`}
      </div>
    </div>
  )
}

const TaskList = props => {
  const { taskList, setTaskModal } = props
  const handleClick = task => {
    setTaskModal({ visible: true, task: task })
  }
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={taskList}
      renderItem={task => (
        <List.Item
          key={task.id}
          onClick={handleClick.bind(null, task)}
          extra={
            <TaskOutStanding time={'2019-06-13 20:20'} reward={task.reward} />
          }
        >
          <List.Item.Meta title={task.title} />
          {task.content.substr(0, 100) + '...'}
        </List.Item>
      )}
    />
  )
}

export default TaskList
