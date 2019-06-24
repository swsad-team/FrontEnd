import { Button, Descriptions, Popconfirm, Skeleton, message } from 'antd'

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
    params: { tid }
  }
}) {
  const [task, setTask] = useState(null)
  useEffect(() => {
    let isSubscribe = true
    const fetchTask = async tid => {
      const { errorMessage, ...task } = await taskApi.getTaskById(tid)
      if (errorMessage) {
        message.error(errorMessage)
      } else if (isSubscribe) {
        setTask(task)
      }
    }
    fetchTask(tid)
    return () => (isSubscribe = false)
  }, [tid])

  const handleComplete = async (uid) => {
    const { errorMessage, ...data } = await taskApi.confirmTaskFinishedByUser(tid, uid)
    if (errorMessage) {
      message.error(errorMessage)
    } else {
      console.log(data)
    }
  }

  return (
    <>
      {task ? (
        <div className={styles.content}>
          <h1 className={styles.title}>{task.title}</h1>
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
  onComplete: PropTypes.func.isRequired
}

export default TaskInfo
