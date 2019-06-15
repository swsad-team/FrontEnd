import { Button, Icon } from 'antd'
import React, { useState } from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './TaskList.module.css'

function TaskList({ tasks }) {
  const [select, setSelect] = useState(null)
  const handleSelect = index => expand => {
    if (expand) setSelect(index)
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
  const itemClass = classNames(styles.taskItem, {
    [styles.expand]: expand
  })
  const expandContent = (
    <div className={styles.expandContent}>
      <div>description ········</div>
      <div>共需多少人</div>
      <div>发布日</div>
      <div>结束日</div>
    </div>
  )
  const getButton = <Button onClick={onClick}>GET</Button>
  const endButton = <Button disabled>已结束</Button>
  const attendButton = <Button disabled>已参加</Button>
  return (
    <div className={itemClass}>
      <div className={styles.info} onClick={() => onSelect(!expand)}>
        <span>
          <Icon theme="filled" style={{ color: '#f6c247' }} type="pay-circle" />
          {3}
        </span>
        <span className={styles.title}>标题</span>
        <span className={styles.type}>类型</span>
        <span className={styles.publisher}>发布者 </span>
        <span className={styles.date}>日期</span>
        {getButton}
      </div>
      {expand ? expandContent : null}
    </div>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  onClick: PropTypes.func
}

export default TaskList
