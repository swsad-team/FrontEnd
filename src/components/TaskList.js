import React, { useState, useEffect } from 'react'
import { List } from 'antd'

const useCountDown = time => {
  const [countDown, setCountDown] = useState('')
  const computeCountDown = time => {
    const leftTime = time - Date.now()
    console.log(leftTime)
    const day = parseInt(leftTime / 1000 / 60 / 60 / 24, 10)
    const hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10)
    const minutes = parseInt((leftTime / 1000 / 60) % 60, 10)
    let str = ''
    if (leftTime > 0) {
      str += '剩余: '
      str += day ? `${day}天:` : ''
      str += `${hours}小时:${minutes}分钟`
    } else {
      str = '已结束'
    }
    return str
  }
  let past = 0,
    timer
  useEffect(() => {
    setCountDown(computeCountDown(time))
    timer = setInterval(() => {
      past += 1000 * 60
      setCountDown(computeCountDown(time - past))
    }, 1000 * 60)
    return () => {
      clearInterval(timer)
    }
  }, [time])

  return countDown
}

const TaskOutStanding = props => {
  const { time, reward } = props
  let countDown = useCountDown(time)
  return (
    <div>
      {countDown}
      <div>
        {`${reward}金币`}
      </div>
    </div>
  )
}


const TaskList = props => {
  const { taskList, setTaskModal } = props
  const handleClick = (task) => {
    setTaskModal({visible: true, task: task})
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
          extra={<TaskOutStanding time={Date.now() + 1000 * 60 * 34} reward={task.reward} />}
        >
          <List.Item.Meta title={task.title} />
          {task.content.substr(0, 100) + '...'}
        </List.Item>
      )}
    />
  )
}

export default TaskList
