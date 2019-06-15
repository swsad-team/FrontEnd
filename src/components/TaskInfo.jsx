import { Button, Descriptions } from 'antd'

import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import styles from './TaskInfo.module.css'

function TaskInfo({ task, onComplete }) {
  const handleComplete = uid => () => onComplete(uid)
  const Item = ({ uid, name, isFinished }) => (
    <div className={styles.participantItem}>
      {name}
      {isFinished ? (
        <Button onClick={handleComplete(uid)}>完成任务</Button>
      ) : (
        <Button disabled>已完成</Button>
      )}
    </div>
  )
  console.log(task)
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>{task.title}</h1>
      <Descriptions className={styles.description}>
        <Descriptions.Item label="描述">{task.description}</Descriptions.Item>
        <Descriptions.Item label="需要人数">
          {task.numOfPeople}
        </Descriptions.Item>
        <Descriptions.Item label="参加人数">
          {task.participants.length}
        </Descriptions.Item>
        <Descriptions.Item label="开始时间">
          {moment(task.startTime).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="结束时间">
          {moment(task.endTime).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
      </Descriptions>
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
    </div>
  )
}

TaskInfo.propTypes = {
  task: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default TaskInfo
