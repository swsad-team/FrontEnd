import {
  Button,
  Descriptions,
  Popconfirm,
  Skeleton,
  message,
  Tooltip,
} from 'antd'

import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import styles from './TaskInfo.module.css'
import SurveyAnswerContainer from './SurveyAnswerContainer'
import { taskApi } from '../apis'

function CommonTask({ task, onComplete }) {
  const handleComplete = uid => () => onComplete(uid)
  const Item = ({ uid, name, isFinished }) => (
    <div className={styles.participantItem}>
      {name}
      {isFinished ? (
        <Popconfirm
          title="此操作不可撤销"
          onConfirm={handleComplete(uid)}
          okText="确定"
          cancelText="取消"
        >
          <Button>完成任务</Button>
        </Popconfirm>
      ) : (
        <Button disabled>已完成</Button>
      )}
    </div>
  )

  return (
    <div className={styles.participantList}>
      {task.participants
        .filter(uid => !task.finishers.includes(uid))
        .map((val, i) => (
          <Item key={i} uid={val} name={val} isFinished={true} />
        ))}
      {task.participants
        .filter(uid => task.finishers.includes(uid))
        .map((val, i) => (
          <Item key={i} uid={val} name={val} isFinished={false} />
        ))}
    </div>
  )
}

function TaskInfo({
  match: {
    params: { tid },
  },
}) {
  const [task, setTask] = useState(null)
  const [buttonLoading, setButtonLoading] = useState(true)
  useEffect(() => {
    let isSubscribe = true
    const fetchTask = async tid => {
      const { errorMessage, ...task } = await taskApi.getTaskById(tid)
      if (errorMessage) {
        message.error(errorMessage)
      } else if (isSubscribe) {
        setTask(task)
        setButtonLoading(false)
      }
    }
    fetchTask(tid)
    return () => (isSubscribe = false)
  }, [tid])

  const handleComplete = async uid => {
    const { errorMessage, ...task } = await taskApi.finishTask(tid, uid)
    if (errorMessage) {
      message.error(errorMessage)
    } else {
      setTask(task)
      message.success('操作成功！')
    }
  }
  const handleCancelTask = async () => {
    const { errorMessage, ...task } = await taskApi.cancelTask(tid)
    if (errorMessage) {
      message.error(errorMessage)
    } else {
      setTask(task)
      message.success('操作成功！')
    }
  }
  let cancelButton = (
    <Popconfirm
      okText="确定"
      cancelText="取消"
      title="确定要取消吗？"
      onConfirm={handleCancelTask}
    >
      <Button loading={buttonLoading}>取消任务</Button>
    </Popconfirm>
  )
  if (!task) {
  } else if (task.participants.length !== task.finishers.length) {
    cancelButton = (
      <Tooltip title="仍有未完成的参加者">
        <Button disabled>取消任务</Button>
      </Tooltip>
    )
  } else if (task.isCancel) {
    cancelButton = <Button disabled>任务已取消</Button>
  } else if (!task.isValid) {
    cancelButton = <Button disabled>任务已结束</Button>
  }
  return (
    <>
      {task ? (
        <div className={styles.content}>
          <div>
            <h1 className={styles.title}>{task.title}</h1>
            {cancelButton}
          </div>
          <Descriptions className={styles.description}>
            <Descriptions.Item label="描述">
              {task.description}
            </Descriptions.Item>
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
          {task.isQuestionnaire ? (
            <SurveyAnswerContainer tid={tid} />
          ) : (
            <CommonTask task={task} onComplete={handleComplete} />
          )}
        </div>
      ) : (
        <Skeleton />
      )}
    </>
  )
}

CommonTask.propTypes = {
  task: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
}

export default TaskInfo
