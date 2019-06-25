import { Button, Descriptions, Icon, List, message, Tooltip } from 'antd'
import React, { useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { UserContext } from '../context'
import classNames from 'classnames'
import moment from 'moment'
import styles from './TaskList.module.css'
import { withRouter } from 'react-router'
import { taskApi } from '../apis'
function TaskList({ tasks, history }) {
  const [select, setSelect] = useState(null)
  const handleSelect = index => expand => {
    if (expand) setSelect(index)
    else setSelect(null)
  }

  return (
    <div className={styles.taskList}>
      <List
        header={
          <div className={styles.header}>
            <span>悬赏金</span>
            <span>标题</span>
            <span>类型</span>
            <span>发布者</span>
            <span>开始时间</span>
            <span>操作</span>
          </div>
        }
        itemLayout="horizontal"
        dataSource={tasks}
        renderItem={(item, i) => (
          <WrappedTaskItem
            history={history}
            key={i}
            task={item}
            expand={select === i}
            onSelect={handleSelect(i)}
          />
        )}
      />
    </div>
  )
}

function TaskItem({ task: initialTask, onSelect, expand = false, history }) {
  const [loading, setLoading] = useState(false)
  const [task, setTask] = useState(initialTask)
  const userContext = useContext(UserContext)
  const uid = userContext.userInfo.uid
  console.log(task)
  const attendTask = async () => {
    setLoading(true)
    taskApi.participateTask(task.tid).then(task => {
      if (task.errorMessage) {
        message.error(task.errorMessage)
      } else {
        setTask(task)
        message.success('成功参加')
      }
      setLoading(false)
    })
  }

  let button = (
    <Button
      type="primary"
      onClick={e => {
        e.stopPropagation()
        attendTask()
      }}
      loading={loading}
    >
      GET
    </Button>
  )
  if (
    task.publisherId === uid &&
    task.participants.length > task.finishers.length &&
    !task.isQuestionnaire
  ) {
    button = (
      <Tooltip title="存在未完成的参加者">
        <Button
          type="primary"
          onClick={e => {
            e.stopPropagation()
            history.push(`/tasks/${task.tid}/info`)
          }}
        >
          待确认
        </Button>
      </Tooltip>
    )
  } else if (task.publisherId === uid) {
    button = (
      <Button
        onClick={e => {
          e.stopPropagation()
          history.push(`/tasks/${task.tid}/info`)
        }}
      >
        查看任务
      </Button>
    )
  } else if (
    task.participants.length === task.numOfPeople &&
    task.endTime > Date.now()
  ) {
    button = <Button disabled>已结束</Button>
  } else if (task.finishers.includes(uid)) {
    button = <Button disabled>已完成</Button>
  } else if (task.participants.includes(uid) && task.isQuestionnaire) {
    button = (
      <Button
        type="primary"
        onClick={e => {
          e.stopPropagation()
          history.push(`/tasks/${task.tid}/survey`)
        }}
      >
        填写问卷
      </Button>
    )
  } else if (task.participants.includes(uid) && !task.isQuestionnaire) {
    button = (
      <Tooltip title="等待发起者确认任务完成">
        <Button disabled>参加中</Button>
      </Tooltip>
    )
  }
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
  const itemClass = classNames(styles.taskItem, {
    [styles.expand]: expand,
  })
  return (
    <div className={itemClass}>
      <div className={styles.info} onClick={e => onSelect(!expand)}>
        <span className={styles.reward}>
          <Icon theme="filled" type="pay-circle" />
          {task.reward}
        </span>
        <span className={styles.title}>{task.title}</span>
        <span className={styles.type}>
          {task.isQuestionnaire ? '调查问卷' : '其他任务'}
        </span>
        <span className={styles.publisher}>{task.publisherId} </span>
        <span className={styles.date}>
          {moment(task.endTime).format('YYYY-MM-DD HH:mm')}
        </span>
        {button}
      </div>
      {expand ? expandContent : null}
    </div>
  )
}

const WrappedTaskItem = withRouter(TaskItem)

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
}

export default TaskList
