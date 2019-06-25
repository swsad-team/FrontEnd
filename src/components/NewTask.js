import React, { useState } from 'react'
import { Steps, message } from 'antd'
import { Link } from 'react-router-dom'

import { taskApi } from '../apis'

import './NewTask.css'

import CreateSurvey, { SurveyList } from './CreateSurvey'
import WrappedTaskBasicForm from './TaskBasicForm'
import moment from 'moment'

const { Step } = Steps

const NewTaskPage = props => {
  const [basicValues, setBasicValues] = useState({
    endTime: moment().add(1, 'days')
  })
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
    if (!values.isQuestionnaire) {
      taskApi.createTask(values).then(({ errorMessage }) => {
        if (errorMessage) {
          message.error(errorMessage)
        } else {
          message.success('任务创建成功')
          next()
        }
      })
    } else {
      next()
    }
  }

  const handleTypeChange = values => {
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
    setSurveyData(surveyData.filter((item, _index) => _index !== index))
  }

  const handleSurveySubmit = () => {
    if (surveyData.length === 0) {
      message.error('问卷不能为空')
    } else {
      taskApi
        .createTaskWithSurvey(basicValues, surveyData)
        .then(({ errorMessage }) => {
          if (errorMessage) {
            message.error(errorMessage)
          } else {
            message.success('任务创建成功')
            next()
          }
        })
    }
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
      <div>
        {basicValues.isQuestionnaire ? (
          <>
            <h1>问卷内容</h1>
            <SurveyList dataSource={surveyData} />
          </>
        ) : null}
        <div className="feedback">
          <p>任务创建成功</p>
          <Link to="/">返回首页</Link>
        </div>
      </div>
    )
  }

  const steps = basicValues.isQuestionnaire
    ? [basciPage, surveyPage, confirmPage]
    : [basciPage, confirmPage]

  return (
    <div className="container">
      <Steps current={currentStep} className="task-steps">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="task-container">{steps[currentStep].content}</div>
    </div>
  )
}

export default NewTaskPage
