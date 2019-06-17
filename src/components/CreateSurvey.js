import React, { useState } from 'react'
import {
  Form,
  Card,
  List,
  Checkbox,
  Select,
  Button,
  Input,
  message,
  Divider,
  Icon
} from 'antd'

import styles from './CreateSurvey.module.css'

const { Option } = Select

  const getTypeDisplayName = type => {
    const typeToZh = {
      radio: '单选',
      multyCheck: '多选',
      text: '文本'
    }
    return typeToZh[type] || '文本'
  }

export const SurveyList = props => {
  const { dataSource, removeItem } = props
  const handleClick = index => {
    removeItem && removeItem(index)
  }
  return (
    <List
      dataSource={dataSource}
      itemLayout="horizontal"
      bordered
      renderItem={(item, index) => (
        <List.Item className={styles.questionItem}>
          <label>问题{index + 1}: </label>
          <label>标题: </label> <span> {item.title}</span>
          <label>类型: </label> <span> {getTypeDisplayName(item.type)} </span>
          {item.options && item.options.length ? (
            <>
              <label>选项: </label> <span>{String(item.options)}</span>
            </>
          ) : null}
          <span></span>
          {removeItem && (
            <Icon type="delete" onClick={e => handleClick(index)} />
          )}
        </List.Item>
      )}
    />
  )
}

const Choices = props => {
  const { onChange, addChoiceValidate, choices } = props
  const [value, setValue] = useState('')
  const [first, setFirst] = useState(true)
  let [validateStatus, help] = first
    ? ['success', '']
    : addChoiceValidate(value.trim(), choices)
  const handleAdd = () => {
    if (validateStatus === 'success') {
      onChange(choices.concat(value.trim()))
      setValue('')
      setFirst(true)
    }
  }
  return (
    <>
      <Form.Item label="选项列表">
        {choices.length !== 0 && (
          <List
            style={{ paddingLeft: '12px' }}
            dataSource={choices}
            renderItem={(item, index) => {
              return (
                <div className={styles.optionItem}>
                  <span>{`选项${index + 1}: `}</span>
                  <Checkbox checked={false}>{item}</Checkbox>
                </div>
              )
            }}
          />
        )}
      </Form.Item>
      <AddOption
        validateStatus={validateStatus}
        help={help}
        prefix={`选项${choices.length + 1}`}
        value={value}
        onChange={v => {
          setFirst(false)
          setValue(v)
        }}
        addButton={
          <Button disabled={first} type="primary" onClick={handleAdd}>
            新增选项
          </Button>
        }
      />
    </>
  )
}

const AddOption = props => {
  const { prefix, onChange, validateStatus, help, value, addButton } = props

  return (
    <Form.Item validateStatus={validateStatus} help={help}>
      <div className={styles.addOption}>
        <Input
          addonBefore={prefix}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {addButton}
      </div>
    </Form.Item>
  )
}

const QuestionLimit = props => {
  const { isRequired, type, onRequiredChange, onTypeChange, types } = props

  return (
    <div>
      <label>问题类型: </label>
      <Checkbox
        checked={isRequired}
        onChange={e => onRequiredChange(e.target.checked)}
      >
        必填
      </Checkbox>
      <Select defaultValue={type} onChange={v => onTypeChange(v)}>
        {types.map(type => (
          <Option key={type}>{getTypeDisplayName(type)}</Option>
        ))}
      </Select>
    </div>
  )
}

const TitleInput = props => {
  const { value, onChange } = props
  return (
    <Form.Item label="标题">
      <Input.TextArea
        value={value}
        autosize={{ minRows: 1, maxRows: 2 }}
        maxLength="400"
        onChange={e => {
          const value = e.target.value
          onChange(value)
        }}
      />
    </Form.Item>
  )
}

const CreateQuestion = props => {
  const { onCreate } = props
  const types = ['radio', 'multyCheck', 'text']
  const initData = {
    title: '',
    isRequired: true,
    type: types[0],
    options: []
  }
  const [isOpen, setOpen] = useState(false)
  const [questionData, setQuestionData] = useState(initData)

  const validators = {
    choiceItem: v => {
      if (v) {
        return ['success', '']
      } else {
        return ['error', '选项不能为空']
      }
    },
    choiceRepeat: (v, vs) => {
      if (!vs.includes(v)) {
        return ['success', '']
      } else {
        return ['error', '选项已存在']
      }
    },
    choiceAdd: (v, vs) => {
      let help
      ;[validators.choiceItem, validators.choiceRepeat].find(
        validate => (help = validate(v, vs)[1])
      )
      const status = help ? 'error' : 'success'
      return [status, help]
    }
  }

  const handleChange = type => {
    return value => {
      setQuestionData({ ...questionData, [type]: value })
    }
  }

  const handleOpenChange = () => {
    setOpen(!isOpen)
    if (!isOpen) {
      setQuestionData(initData)
    }
    setTimeout(() => {
      const t = document.getElementsByClassName('anchor')[0]
      t && t.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

  const handleAdd = () => {
    if (questionData.title.trim().length < 3) {
      message.error('问题标题需要至少三个字')
    } else if (
      questionData.type !== 'text' &&
      questionData.options.length < 1
    ) {
      message.error('选择题至少有一个选项')
    } else {
      if (onCreate(questionData)) {
        setQuestionData(initData)
        setOpen(false)
      }
    }
  }

  const handleSelectChange = value => {
    setQuestionData({
      type: value,
      options: [],
      isRequired: true,
      title: questionData.title
    })
  }

  const OpenButton = (
    <Button
      type="primary"
      className={styles.openBtn}
      onClick={handleOpenChange}
    >
      添加问题
    </Button>
  )
  const CancleButton = <Button onClick={handleOpenChange}>取消</Button>
  const AddButton = (
    <Button className="anchor" type="primary" onClick={handleAdd}>
      添加问题
    </Button>
  )

  return (
    <div className={styles.addQuestionContainer}>
      {!isOpen ? (
        OpenButton
      ) : (
          <>
            <Divider>新问题</Divider>
          <QuestionLimit
            isRequired={questionData.isRequired}
            types={types}
            type={questionData.type}
            onRequiredChange={handleChange('isRequired')}
            onTypeChange={handleSelectChange}
          />
          <TitleInput
            value={questionData.title}
            onChange={handleChange('title')}
          />
          {questionData.type === 'text' ? null : (
            <Choices
              onChange={handleChange('options')}
              addChoiceValidate={validators['choiceAdd']}
              choices={questionData.options}
            />
          )}
          <span className={styles.bottomBar}>
            {CancleButton}
            {AddButton}
          </span>
        </>
      )}
    </div>
  )
}

const CreateSurvey = props => {
  const { onChange, surveyData, onSubmit, onRemove, onPrev } = props

  return (
    <div>
      <h1>问卷内容</h1>
      <SurveyList
        dataSource={surveyData}
        removeItem={index => onRemove(index)}
      />
      <CreateQuestion onCreate={onChange} />
      <div className={styles.bottomBar}>
        <Button onClick={onPrev}>返回上步</Button>
        <Button onClick={onSubmit} type="primary">
          发布问卷
        </Button>
      </div>
    </div>
  )
}

export default CreateSurvey
