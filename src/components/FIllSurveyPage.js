import React, { useState } from 'react'
import { Form, Radio, Checkbox, Input, Button, message } from 'antd'
import styles from './FillSurveyPage.module.css'

const FillSurvey = props => {
  const { surveyData } = props
  const { getFieldDecorator } = props.form
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const toQuestion = question => {
    const itemMap = {
      radio: (
        <Radio.Group>
          {question.options.map(item => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      ),
      multyCheck: <Checkbox.Group options={question.options} />,
      text: <Input />
    }
    return (
      <Form.Item className={styles.formLabel} key={question.title} label={question.title}>
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

  const toAnswer = question => {
    console.log(question)
    const itemMap = {
      radio: () => (
        <Radio.Group value={question.answer}>
          {question.options.map(item => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      ),
      multyCheck: () => (
        <Checkbox.Group value={question.answer} options={question.options} />
      ),
      text: () => <Input value={question.answer} />
    }
    return (
      <Form.Item className={styles.formLabel} key={question.title} label={question.title}>
        {itemMap[question.type]()}
      </Form.Item>
    )
  }

  const toFormItem = question =>
    'answer' in question ? toAnswer(question) : toQuestion(question)
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        // TODO: connet answer api
        console.log('Received values of form: ', values)
        setLoading(true)
        new Promise((res, rej) => {
          setTimeout(() => {
            res()
          }, 1000)
        }).then(() => {
          message.success('完成问卷')
          setLoading(false)
          setCompleted(true)
        })
      }
    })
  }

  return (
    <div>
      {completed ? (
        <div className="feedback">
          <p>完成问卷</p>
          <a href="/">返回首页</a>
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

const FillSurveyPage = ({ match }) => {
  const taskId = match.params.taskId
  console.log('taskId', taskId)
  const surveyData = [
    {
      title: 'radio 1',
      isRequired: true,
      type: 'radio',
      options: ['1', '2', '3'],
      answer: '1'
    },
    {
      title: 'check 1',
      isRequired: true,
      type: 'multyCheck',
      options: ['1', '2', '3'],
      answer: ['1', '3']
    },
    {
      title: 'text 1',
      isRequired: true,
      type: 'text',
      options: []
    },
    {
      title: 'radio 2',
      isRequired: false,
      type: 'radio',
      options: ['1', '2', '3']
    },
    {
      title: 'check 2',
      isRequired: false,
      type: 'multyCheck',
      options: ['1', '2', '3', '4']
    },
    {
      title: 'text 2',
      isRequired: false,
      type: 'text',
      options: [],
      answer: 'jaskldfa'
    }
  ]

  return (
    <div className={styles.surveyPage}>
      <h1> 问卷: {taskId} </h1>
      <WrappedFillSurvey surveyData={surveyData} />
    </div>
  )
}

export default FillSurveyPage
