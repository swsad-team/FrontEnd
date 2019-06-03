import React, { useState } from 'react'
import {
  Card,
  Form,
  InputNumber,
  Input,
  DatePicker,
  Button,
  Alert,
  Radio,
  Steps
} from 'antd'
import moment from 'moment'
import './NewTask.css'

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
          })(<TextArea autosize={{ minRows: 2, maxRows: 10 }} />)}
        </Form.Item>
        <Form.Item>
          <Button onClick={() => onSubmit(props.form.getFieldsValue(), 'prev')}>
            返回上步
          </Button>
          <Button type="primary" htmlType="submit">
            下一步
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const WrappedCommonTaskDetialForm = Form.create({ name: 'task_basic' })(
  CommonTaskDetialForm
)

const TaskBasicForm = props => {
  const { onSubmit, formValues } = props
  const [tipTime, setTipTime] = useState('')

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

  const disabledDate = current => {
    return current && current < moment().subtract('seconds', moment().seconds())
  }

  const handleDueTimeChange = _moment => {
    if (!_moment) {
      setTipTime('')
    } else {
      setTipTime(`任务将${_moment.fromNow(true)}后结束`)
    }
  }
  const commonFields = [
    {
      type: 'title',
      options: {
        rules: [
          {
            min: 5,
            max: 30,
            required: true,
            message: '输入5-30字的标题'
          }
        ]
      }
    },
    {
      type: 'isSurvey',
      options: {
        initialValue: false
      }
    },
    {
      type: 'dueTime',
      options: {
        rules: [
          {
            required: true,
            message: '请输入截至日期'
          }
        ]
      }
    },
    {
      type: 'reward',
      options: {
        initialValue: 1
      }
    },
    {
      type: 'maximumParticipators',
      options: {
        initialValue: 1
      }
    }
  ]

  commonFields.forEach(item => {
    if (item.type in formValues) {
      item.options.initialValue = formValues[item.type]
    }
  })

  const { getFieldDecorator } = props.form
  const commonDecorators = {}
  commonFields.forEach(field => {
    commonDecorators[field.type] = getFieldDecorator(field.type, field.options)
  })

  return (
    <Card title="任务" className="task-card">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item label="标题">
          {commonDecorators['title'](<Input type="text" />)}
        </Form.Item>
        <Form.Item label="任务类型">
          {commonDecorators['isSurvey'](
            <Radio.Group>
              <Radio value={false}>普通任务</Radio>
              <Radio value={true}>问卷</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="截至时间">
          {commonDecorators['dueTime'](
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime={{
                format: 'HH:mm'
              }}
              disabledDate={disabledDate}
              onChange={handleDueTimeChange}
            />
          )}
          {tipTime && <Alert message={tipTime} type="info" showIcon />}
        </Form.Item>
        <Form.Item label="悬赏">
          {commonDecorators['reward'](<InputNumber min={1} suffix="金币" />)}
        </Form.Item>
        <Form.Item label="最多参与人数">
          {commonDecorators['maximumParticipators'](<InputNumber min={1} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            发布任务
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const WrappedTaskBasicForm = Form.create({ name: 'task_basic' })(TaskBasicForm)

const NewTaskPage = props => {
  const [basicValues, setBasicValues] = useState({})
  const [commonTaskDetialValues, setCommonTaskDetialValues] = useState({})
  const [currentStep, setCurrentStep] = useState(0)

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
      content: (
        <WrappedCommonTaskDetialForm
          formValues={commonTaskDetialValues}
          onSubmit={handleCommonDetialSubmit}
          prev={prev}
        />
      )
    },
    {
      title: '发布任务',
      content: (
        <div>
          detail
          <Button onClick={() => prev()}>返回上步</Button>
          <Button onClick={() => next()}>发布任务</Button>
        </div>
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
