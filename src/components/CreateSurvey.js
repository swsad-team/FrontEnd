import React, { forwardRef, useState, useRef } from 'react'
import {
  Form,
  Card,
  List,
  Row,
  Col,
  Checkbox,
  Select,
  Button,
  Divider,
  Input
} from 'antd'

const { Option } = Select

export const SurveyList = props => {
  const { dataSource, removeItem } = props
  const handleClick = (index) => {
    removeItem && removeItem(index)
  }
  return (
    <List
      dataSource={dataSource}
      itemLayout="horizontal"
      bordered
      renderItem={(item, index) => (
        <List.Item>
          <label>问题{index + 1}: </label>
          <label>标题: </label> <span> {item.title}</span>
          <label>类型: </label> <span> {item.type} </span>
          {item.options && item.options.length ? (
            <>
              <label>选项: </label> <span>{String(item.options)}</span>
            </>
          ) : null}
          {removeItem && <Button onClick={e => handleClick(index)}>X</Button>}
        </List.Item>
      )}
    />
  )
}

const AddOption = props => {
  const { prefix, onChange, validateStatus, help } = props
  const [value, setValue] = useState('')

  return (
    <Form.Item validateStatus={validateStatus} help={help}>
      <div className={{ display: 'flex' }}>
        {prefix}
        <Input value={value} onChange={e => setValue(e.target.value)} />
        <Button type="primary" onClick={() => onChange(value)}>
          新增选项
        </Button>
      </div>
    </Form.Item>
  )
}

const CreateQuestion = (props, ref) => {
  const { onCreate } = props
  const types = ['radio', 'multyCheck', 'text']
  const [isOpen, setOpen] = useState(false)
  const [questionData, setQuestionData] = useState({
    title: '',
    isRequired: true,
    type: types[0],
    options: []
  })

  const [validate, setValidate] = useState({
    validateStatus: 'success',
    help: ''
  })

  const [validateTitle, setValidateTitle] = useState({
    validateStatus: 'success',
    help: ''
  })

  const getTypeDisplayName = type => {
    let name = ''
    switch (type) {
      case 'radio':
        name = '单选'
        break
      case 'multyCheck':
        name = '多选'
        break
      case 'text':
        name = '文本'
        break
      default:
        break
    }
    return name
  }

  const handleOpenChange = () => {
    setOpen(!isOpen)
  }

  const titleValidator = title => {
    if (title && title.length >= 3) {
      setValidateTitle({ validateStatus: 'success', help: '' })
      return true
    } else {
      setValidateTitle({ validateStatus: 'error', help: '问题标题至少3个字' })
      return false
    }
  }

  const handleAdd = () => {
    if (titleValidator(questionData.title)) {
      let flag = false
      if (questionData.type !== 'text') {
        if (questionData.options.length >= 1) {
          flag = onCreate(questionData)
        } else {
          setValidate({ validateStatus: 'error', help: '选择题至少有一个选项' })
        }
      } else {
        flag = onCreate(questionData)
      }
      if (flag) {
        setOpen(false)
        setQuestionData({
          title: '',
          isRequired: true,
          type: types[0],
          options: []
        })
      }
    }
  }

  const handleSelectChange = value => {
    setQuestionData({ type: value, options: [], isRequired: true, title: '' })
  }

  const addChoiceItem = value => {
    const optionName = value
    const options = questionData.options || []
    if (optionName.trim().length === 0) {
      setValidate({ validateStatus: 'error', help: '选项不能为空' })
    } else if (!options.includes(optionName)) {
      setQuestionData({
        ...questionData,
        options: questionData.options.concat(optionName)
      })
      setValidate({ validateStatus: 'success', help: '' })
    } else {
      setValidate({ validateStatus: 'error', help: '选项已存在' })
    }
  }

  const Choices = () => {
    return (
      <>
        {'选项: \n'}
        {questionData.options.length !== 0 && (
          <List
            dataSource={questionData.options}
            renderItem={(item, index) => {
              return (
                <div>
                  {`选项${index + 1}: `}{' '}
                  <Checkbox checked={false}>{item}</Checkbox>
                </div>
              )
            }}
          />
        )}
        <AddOption
          {...validate}
          prefix={`选项${questionData.options.length + 1}`}
          onChange={addChoiceItem}
        />
      </>
    )
  }
  const OpenButton = <Button onClick={handleOpenChange}>添加问题</Button>
  const CancleButton = <Button onClick={handleOpenChange}>取消</Button>
  const AddButton = <Button onClick={handleAdd}>添加问题</Button>

  const TitleInput = props => {
    const { value, onBlur, validateStatus, help } = props
    const [formData, setFormData] = useState({
      value: value,
      validateStatus: validateStatus,
      help: help
    })
    return (
      <Form.Item
        label="标题"
        validateStatus={formData.validateStatus}
        help={formData.help}
      >
        <Input.TextArea
          value={formData.value}
          autosize={{ minRows: 2, maxRows: 4 }}
          maxLength="400"
          onChange={e => {
            const value = e.target.value
            if (value && value.length >= 3) {
              setFormData({ value, validateStatus: 'success', help: '' })
            } else {
              setFormData({
                value,
                validateStatus: 'error',
                help: '问题标题至少3个字'
              })
            }
          }}
          onBlur={() => onBlur(formData.value)}
        />
      </Form.Item>
    )
  }
  const QuestionLimit = () => {
    return (
      <div>
        {'问题类型: '}
        <Checkbox
          checked={questionData.isRequired}
          onChange={e =>
            setQuestionData({ ...questionData, isRequired: e.target.checked })
          }
        >
          必填
        </Checkbox>
        <Select defaultValue={questionData.type} onChange={handleSelectChange}>
          {types.map(type => (
            <Option key={type}>{getTypeDisplayName(type)}</Option>
          ))}
        </Select>
      </div>
    )
  }

  return (
    <div>
      {!isOpen ? (
        OpenButton
      ) : (
        <>
          <TitleInput
            value={questionData.title}
            {...validateTitle}
            onBlur={title => {
              titleValidator(title)
              setQuestionData({ ...questionData, title })
            }}
          />
          <QuestionLimit />
          {questionData.type === 'text' ? null : <Choices />}
          {AddButton}
          {CancleButton}
        </>
      )}
    </div>
  )
}

const CreateSurvey = props => {
  const { onChange, surveyData, onSubmit, onRemove, onPrev } = props

  return (
    <Card title="问卷">
      <SurveyList dataSource={surveyData} removeItem={(index) => onRemove(index)}/>
      <CreateQuestion onCreate={onChange} />
      <Button onClick={onPrev}>返回上步</Button>
      <Button onClick={onSubmit}>完成问卷</Button>
    </Card>
  )
}

export default CreateSurvey
