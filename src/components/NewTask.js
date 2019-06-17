import React, { useState } from 'react'
import { Card, Steps, message } from 'antd'

import './NewTask.css'

import CreateSurvey, { SurveyList } from './CreateSurvey'
import WrappedTaskBasicForm from './TaskBasicForm'

const { Step } = Steps

const NewTaskPage = props => {
  const [basicValues, setBasicValues] = useState({})
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
        {basicValues.isSurvey ? <SurveyList dataSource={surveyData} /> : null}
        <a href="/">返回首页</a>
      </Card>
    )
  }

  const steps = basicValues.isSurvey
    ? [basciPage, surveyPage, confirmPage]
    : [basciPage, confirmPage]

  return (
    <div className="container">
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </div>
  )
}

export default NewTaskPage
