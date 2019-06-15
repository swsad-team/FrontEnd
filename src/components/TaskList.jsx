import { Button, Descriptions, Icon } from 'antd'
import React, { useState } from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import styles from './TaskList.module.css'

function TaskList({ tasks }) {
  const [select, setSelect] = useState(null)
  const handleSelect = index => expand => {
    if (expand) setSelect(index)
    else setSelect(null)
  }
  return (
    <div className={styles.taskList}>
      {tasks.map((val, i) => (
        <TaskItem
          key={i}
          task={val}
          expand={select === i}
          onSelect={handleSelect(i)}
        />
      ))}
    </div>
  )
}

function TaskItem({ task, onSelect, onClick, expand = false }) {
  const expandContent = (
    <div className={styles.expandContent}>
      <Descriptions>
        <Descriptions.Item label="描述">{task.description}</Descriptions.Item>
        <Descriptions.Item label="需要人数">
          {task.numOfPeople}
        </Descriptions.Item>
        <Descriptions.Item label="参加人数">
          {task.participants.length}
        </Descriptions.Item>
        <Descriptions.Item label="悬赏金">{task.reward}</Descriptions.Item>
        <Descriptions.Item label="开始时间">
          {moment(task.startTime).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="结束时间">
          {moment(task.endTime).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
  const handleClick = e => {
    console.log(e)
    e.stopPropagation()
  }
  const itemClass = classNames(styles.taskItem, {
    [styles.expand]: expand
  })
  const getButton = <Button onClick={handleClick}>GET</Button>
  const endButton = <Button disabled>已结束</Button>
  const attendButton = <Button disabled>已参加</Button>
  const joinButton = <Button disabled>已完成</Button>
  return (
    <div className={itemClass}>
      <div className={styles.info} onClick={e => onSelect(!expand)}>
        <span className={styles.reward}>
          <Icon theme="filled" type="pay-circle" />
          {3}
        </span>
        <span className={styles.title}>{task.title}</span>
        <span className={styles.type}>
          {task.isQuestionnaire ? '调查问卷' : '其他任务'}
        </span>
        <span className={styles.publisher}>{task.publisher} </span>
        <span className={styles.date}>
          {moment(task.endTime).format('YYYY-MM-DD HH:mm')}
        </span>
        {getButton}
      </div>
      {expand ? expandContent : null}
    </div>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func
}

export default TaskList
