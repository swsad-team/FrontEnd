import React, { useState, useEffect } from 'react'
import { Form, Radio, Checkbox, Input, Button, message, Skeleton } from 'antd'
import styles from './FillSurveyPage.module.css'
import { taskApi } from '../apis'
import { Link } from 'react-router-dom'
const FillSurvey = props => {
  const { surveyData } = props
  const { getFieldDecorator } = props.form
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const toFormItem = question => {
    const itemMap = {
      single: (
        <Radio.Group>
          {question.options.map(item => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      ),
      multiple: <Checkbox.Group options={question.options} />,
      fill: <Input />
    }
    return (
      <Form.Item
        className={styles.formLabel}
        key={question.title}
        label={question.title}
      >
        {getFieldDecorator(question.title, {
          rules: [
            {
              required: question.isRequired,
              message: '此问题是必答题'
            }
          ]
        })(itemMap[question.type])}
      </Form.Item>
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      const answers = surveyData.map(q => values[q.title])
      if (!err) {
        setLoading(true)
        taskApi.finishSurvey(props.taskId, answers).then(({ errorMessage }) => {
          if (errorMessage) {
            message.error(errorMessage)
          } else {
            message.success('完成问卷')
            setLoading(false)
            setCompleted(true)
          }
        })
      }
    })
  }

  return (
    <div className="container">
      {completed ? (
        <div className={styles.feedback}>
          <p>已完成问卷</p>
          <Link to="/">返回首页</Link>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          {surveyData.map(item => toFormItem(item))}
          <Form.Item className={styles.submitBtnWrap}>
            <Button
              className={styles.submitBtn}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              完成问卷
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  )
}

const WrappedFillSurvey = Form.create({ name: 'task_basic' })(FillSurvey)

const FillSurveyPage = ({ match, history }) => {
  const taskId = match.params.tid
  const [loading, setLoading] = useState(true)
  const [survey, setSurvey] = useState(undefined)
  useEffect(() => {
    let isSubscribed = true
    taskApi.getSurveyOfTask(taskId).then(survey => {
      if (!isSubscribed) return
      if (survey.errorMessage) {
        message.error(survey.errorMessage)
      } else {
        setSurvey(survey)
      }
      console.log(survey)
      setLoading(false)
    })
    return () => {
      isSubscribed = false
    }
  }, [])
  return (
    <div className={styles.surveyPage}>
      <h1> 问卷: {taskId} </h1>
      {loading ? (
        <Skeleton />
      ) : survey ? (
        <WrappedFillSurvey surveyData={survey} taskId={taskId} />
      ) : (
        <p>问卷加载失败</p>
      )}
    </div>
  )
}

export default FillSurveyPage
