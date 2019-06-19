import React, { useState } from 'react'
import {
  Form,
  Checkbox,
  Select,
  Button,
  Input,
  message,
  Icon,
  Modal
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
    <div className={styles.surveyList}>
      {dataSource.length !== 0 ? (
        dataSource.map((item, index) => (
          <div className={styles.questionItem}>
            <span className={styles.content}>
              <span>
                <label>问题{index + 1}: </label>
              </span>
              <span>
                <label>标题: </label> {item.title}
              </span>
              <span>
                <label>类型: </label> {getTypeDisplayName(item.type)}
              </span>
              {item.options && item.options.length ? (
                <span className={styles.optionsText}>
                  <label>选项: </label>
                  {String(item.options)}
                </span>
              ) : null}
            </span>
            {removeItem && (
              <Icon
                className={styles.deleteIcon}
                type="delete"
                onClick={e => handleClick(index)}
              />
            )}
          </div>
        ))
      ) : (
        <h3>暂无问题, 请添加</h3>
      )}
    </div>
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
          <div>
            {choices.map((item, index) => {
              return (
                <div className={styles.optionItem}>
                  <label>{`选项${index + 1}: `}</label>
                  <span>{item}</span>
                  <Icon
                    type="close"
                    onClick={() =>
                      onChange([
                        ...choices.slice(0, index),
                        ...choices.slice(index + 1)
                      ])
                    }
                  />
                </div>
              )
            })}
          </div>
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
          <Button
            icon="plus"
            disabled={first}
            type="primary"
            onClick={handleAdd}
          />
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
      <Select value={type} onChange={v => onTypeChange(v)}>
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
    <span className={styles.openBtn}>
      <Button type="dashed" onClick={handleOpenChange}>
        新增问题
      </Button>
    </span>
  )
  const CancleButton = (
    <Button onClick={() => setQuestionData(initData)}>重置</Button>
  )
  const AddButton = (
    <Button type="primary" onClick={handleAdd}>
      添加问题
    </Button>
  )

  return (
    <div className={styles.addQuestionContainer}>
      {OpenButton}
      <Modal
        visible={isOpen}
        onCancel={handleOpenChange}
        footer={
          <span className={styles.bottomBar}>
            {CancleButton}
            {AddButton}
          </span>
        }
      >
        <div className={styles.taskModalBody}>
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
        </div>
      </Modal>
    </div>
  )
}

const CreateSurvey = props => {
  const { onChange, surveyData, onSubmit, onRemove, onPrev } = props

  return (
    <div>
      <h1>问卷内容</h1>
      <div className={styles.surveyContainer}>
        <SurveyList
          dataSource={surveyData}
          removeItem={index => onRemove(index)}
        />
        <CreateQuestion onCreate={onChange} />
      </div>
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
