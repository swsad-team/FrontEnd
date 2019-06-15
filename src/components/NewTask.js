import React, { useState } from 'react'
import { Card, Form, Input, Button, Steps, Divider, message } from 'antd'

import './NewTask.css'

import TaskDetails from './TaskDetails'
import CreateSurvey, { SurveyList } from './CreateSurvey'
import WrappedTaskBasicForm from './TaskBasicForm'

const { Step } = Steps

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

  const handleTypeChange = values => {
    console.log(values)
    setBasicValues(values)
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
    console.log('remove')
    setSurveyData(surveyData.filter((item, _index) => _index !== index))
  }

  const handleSurveySubmit = () => {
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
    taskDescription: '任务详情'
  }

  const basciPage = {
    title: '填写基本信息',
    content: (
      <WrappedTaskBasicForm
        onTypeChange={handleTypeChange}
        formValues={basicValues}
        onSubmit={handleBasicSubmit}
      />
    )
  }

  const surveyPage = {
    title: '填写问卷',
    content: (
      <CreateSurvey
        onSubmit={handleSurveySubmit}
        onPrev={() => prev()}
        onChange={handleAddQuestion}
        onRemove={handleRemoveQuestion}
        surveyData={surveyData}
      />
    )
  }

  const confirmPage = {
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

  const steps = basicValues.isSurvey
    ? [basciPage, surveyPage, confirmPage]
    : [basciPage, confirmPage]

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
