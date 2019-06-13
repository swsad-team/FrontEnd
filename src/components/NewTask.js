import React, { useState } from 'react'
import { Card, Form, Input, Button, Steps, Divider, message } from 'antd'

import './NewTask.css'

import TaskDetails from './TaskDetails'
import CreateSurvey, { SurveyList } from './CreateSurvey'
import WrappedTaskBasicForm from './TaskBasicForm'

const { TextArea } = Input
const { Step } = Steps

const CommonTaskDetialForm = props => {
  const { onSubmit, formValues } = props
  const { getFieldDecorator } = props.form
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // TODO: connet register api
        console.log('Received values of form: ', values)
        onSubmit(values)
      }
    })
  }
  return (
    <Card title="任务">
      <Form onSubmit={handleSubmit}>
        <Form.Item label="任务描述">
          {getFieldDecorator('taskDesciption', {
            initialValue: formValues['taskDesciption'],
            rules: [
              {
                required: true,
                message: '请输入任务详情'
              }
            ]
          })(
            <TextArea autosize={{ minRows: 2, maxRows: 10 }} maxLength={1000} />
          )}
        </Form.Item>
        <Form.Item>
          <Button onClick={() => onSubmit(props.form.getFieldsValue(), 'prev')}>
            返回上步
          </Button>
          <Button type="primary" htmlType="submit">
            发布任务
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const WrappedCommonTaskDetialForm = Form.create({ name: 'task_basic' })(
  CommonTaskDetialForm
)

const NewTaskPage = props => {
  const [basicValues, setBasicValues] = useState({})
  const [commonTaskDetialValues, setCommonTaskDetialValues] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [surveyData, setSurveyData] = useState([])

  const prev = e => {
    setCurrentStep(currentStep - 1)
  }

  const next = e => {
    setCurrentStep(currentStep + 1)
  }

  const handleBasicSubmit = values => {
    setBasicValues(values)
    // TODO: do something
    next()
  }

  const handleCommonDetialSubmit = (values, command = 'next') => {
    setCommonTaskDetialValues(values)
    // TODO: do something
    if (command === 'next') {
      next()
    } else {
      prev()
    }
  }

  const handleAddQuestion = value => {
    console.log(surveyData)
    if (surveyData.some(item => item.title === value.title)) {
      message.error('问题已存在')
      return false
    } else {
      message.success('创建问题成功')
      setSurveyData(surveyData.concat(value))
      return true
    }
  }

  const handleRemoveQuestion = index => {
    setSurveyData(surveyData.filter((item, _index) => _index !== index))
  }

  const handleSurveySubmit = () => {
    // TODO:
    console.log(surveyData)
    next()
  }

  const typeMap = {
    title: '标题',
    isSurvey: '任务类型',
    'isSurvey-false': '普通任务',
    'isSurvey-true': '问卷',
    dueTime: '结束时间',
    limits: '额外限制',
    gender: '性别',
    grade: '学号前缀',
    reward: '悬赏',
    maximumParticipators: '最多参与人数',
    taskDesciption: '任务详情'
  }

  const steps = [
    {
      title: '填写基本信息',
      content: (
        <WrappedTaskBasicForm
          formValues={basicValues}
          onSubmit={handleBasicSubmit}
        />
      )
    },
    {
      title: '填写任务详情',
      content: basicValues.isSurvey ? (
        <CreateSurvey
          onSubmit={handleSurveySubmit}
          onPrev={() => prev()}
          onChange={handleAddQuestion}
          onRemove={handleRemoveQuestion}
          surveyData={surveyData}
        />
      ) : (
        <WrappedCommonTaskDetialForm
          formValues={commonTaskDetialValues}
          onSubmit={handleCommonDetialSubmit}
          prev={prev}
        />
      )
    },
    {
      title: '完成',
      content: (
        <Card>
          <Divider orientation="left">基本信息</Divider>
          <TaskDetails values={basicValues} typeMap={typeMap} />
          <Divider orientation="left">详细信息</Divider>
          {basicValues.isSurvey ? (
            <SurveyList dataSource={surveyData} />
          ) : (
            <TaskDetails values={commonTaskDetialValues} typeMap={typeMap} />
          )}
          <Button>返回首页</Button>
        </Card>
      )
    }
  ]

  return (
    <>
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </>
  )
}

export default NewTaskPage
