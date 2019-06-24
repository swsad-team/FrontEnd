import React, { useState } from 'react'
import { Steps, message } from 'antd'
import { Link } from 'react-router-dom'

import { taskApi } from '../apis';

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
    if (surveyData.length === 0) {
      message.error('问卷不能为空')
    } else {
      const createTaskWithSurvey = async(basic, survey)  => {

        survey = JSON.parse(JSON.stringify(survey).replace(/options/g,"option"));
        survey = JSON.parse(JSON.stringify(survey).replace(/title/g,"questionTitle"));
        survey = JSON.parse(JSON.stringify(survey).replace(/type/g,"questionType"));
        console.log(survey)
        const res = await taskApi.createTaskWithSurvey(
          basic,
          survey
        )
        if (res.errorMessage) {
          message.error(res.errorMessage)
        } else {         
          message.success('任务创建成功')
        }    
      }
      createTaskWithSurvey(basicValues, surveyData)
      next()
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
