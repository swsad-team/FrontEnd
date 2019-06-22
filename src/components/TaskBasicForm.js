import React, { useState } from 'react'
import {
  Form,
  Button,
  Radio,
  DatePicker,
  InputNumber,
  Alert,
  Input,
  message
} from 'antd'

import moment from 'moment'

import styles from './TaskBasicForm.module.css'
import { taskApi } from '../apis';


const { TextArea } = Input

// let LimitForm = ({ value = [], onChange }, ref) => {
//   const options = ['男', '女', '其他']
//   const [limits, setLimits] = useState(value)
//   const [checkedList, setCheckedList] = useState([])
//   const [grade, setGrade] = useState(null)
//   const handleClick = () => {
//     const newLimit = { gender: checkedList, grade: grade }
//     if (!(newLimit.gender.length || grade)) {
//       return
//     }
//     const flag = limits.find(item => {
//       return (
//         item.gender.toString() === newLimit.gender.toString() &&
//         item.grade === newLimit.grade
//       )
//     })
//     if (!flag && onChange) {
//       onChange(limits.concat(newLimit))
//       setLimits(limits.concat(newLimit))
//       setCheckedList([])
//       setGrade(null)
//     }
//   }

//   return (
//     <div ref={ref}>
//       <span>
//         <label>性别:</label>
//         <CheckAllBox
//           withCheckAll={true}
//           options={options}
//           checkedList={checkedList}
//           onChange={setCheckedList}
//         />
//         <label>学号前缀:</label>
//         <InputNumber
//           min={1}
//           value={grade}
//           max={Math.pow(10, 10) - 1}
//           onChange={setGrade}
//         />
//         <Button onClick={handleClick}>添加</Button>
//       </span>
//       {limits.length !== 0 && (
//         <List
//           dataSource={limits}
//           renderItem={item => (
//             <List.Item>
//               性别:{item.gender.join('/')} 学号前缀:{item.grade}{' '}
//             </List.Item>
//           )}
//         />
//       )}
//     </div>
//   )
// }

// LimitForm = forwardRef(LimitForm)

const TaskBasicForm = props => {
  const { onSubmit, formValues, onTypeChange } = props
  const [tipTime, setTipTime] = useState('')
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        console.log(isQuestionnaire)
        if(!isQuestionnaire)  {
          delete values.confirm
          const res = await taskApi.createTask(values)
          if (res.errorMessage) {
            message.error(res.errorMessage)
          } else {         
            onSubmit(values)  
            message.success('任务创建成功')
          }
        } else {
          console.log('Questionnaire')
          onSubmit(values) 
        }       
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
      type: 'isQuestionnaire',
      options: {
        initialValue: false
      }
    },
    {
      type: 'endTime',
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
      type: 'numOfPeople',
      options: {
        initialValue: 1
      }
    },
    {
      type: 'limits',
      options: {}
    },
    {
      type: 'description',
      options: {
        initialValue: formValues['description'],
        rules: [
          {
            required: true,
            message: '请输入任务详情'
          }
        ]
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

  const isQuestionnaire = props.form.getFieldsValue(['isQuestionnaire']).isQuestionnaire
  return (
    <div>
      <h1>任务信息</h1>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item label="标题">
          {commonDecorators['title'](<Input type="text" />)}
        </Form.Item>
        <Form.Item label="任务类型">
          {commonDecorators['isQuestionnaire'](
            <Radio.Group onChange={e => onTypeChange({ ...props.form.getFieldsValue(), isQuestionnaire: e.target.value })}>
              <Radio value={false}>普通任务</Radio>
              <Radio value={true}>问卷</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="截至时间">
          {commonDecorators['endTime'](
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime={{
                format: 'HH:mm'
              }}
              disabledDate={disabledDate}
              onChange={handleDueTimeChange}
            />
          )}
          {tipTime && <Alert style={{width: '200px'}} message={tipTime} type="info" showIcon />}
        </Form.Item>
        <Form.Item label="悬赏">
          {commonDecorators['reward'](<InputNumber min={1} suffix="金币" />)}
        </Form.Item>
        <Form.Item label="最多参与人数">
          {commonDecorators['numOfPeople'](<InputNumber min={1} />)}
        </Form.Item>
        {/* <Form.Item label="额外限制">
          {commonDecorators['limits'](<LimitForm />)}
        </Form.Item> */}
        <Form.Item label="任务详情">
          {commonDecorators['description'](
            <TextArea
              autosize={{ minRows: 2, maxRows: 10 }}
              maxLength={1000}
            />
          )}
        </Form.Item>
        <Form.Item className={styles.bottomBar}>
          <Button type="primary" htmlType="submit">
            {isQuestionnaire ? '继续填写': '发布任务'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
const WrappedTaskBasicForm = Form.create({ name: 'task_basic' })(TaskBasicForm)
export default WrappedTaskBasicForm
