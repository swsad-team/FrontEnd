import React, { useState } from 'react'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Card,
  Radio,
  DatePicker
} from 'antd'
import './RegisterForm.css'
import { Link } from 'react-router-dom'
const { Option } = Select

const RegistrationForm = props => {
  const [confirmDirty, setConfirmDirty] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // TODO: connet register api
        console.log('Received values of form: ', values)
      }
    })
  }

  const handleConfirmBlur = e => {
    const value = e.target.value
    setConfirmDirty(confirmDirty || !!value)
  }

  const compareToFirstPassword = (rule, value, callback) => {
    const form = props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不同')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    const form = props.form
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true }, () => {})
    }
    callback()
  }

  const { getFieldDecorator } = props.form

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 20,
        offset: 2
      }
    }
  }

  const commonFields = [
    {
      type: 'phone',
      options: {
        rules: [
          {
            required: true,
            message: '请输入电话号码'
          }
        ]
      }
    },
    {
      type: 'email',
      options: {
        rules: [
          {
            type: 'email',
            message: '邮箱格式错误'
          },
          {
            required: true,
            message: '请输入邮箱'
          }
        ]
      }
    },
    {
      type: 'password',
      options: {
        rules: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            validator: validateToNextPassword
          }
        ]
      }
    },
    {
      type: 'confirm',
      options: {
        rules: [
          {
            required: true,
            message: '请确认您的密码'
          },
          {
            validator: compareToFirstPassword
          }
        ]
      }
    },
    {
      type: 'nickname',
      options: {
        rules: [
          {
            required: true,
            message: '请输入您的昵称',
            whitespace: true
          }
        ]
      }
    },
    {
      type: 'isOrganization',
      options: {
        initialValue: false
      }
    }
  ]

  const additionalFields = [
    {
      type: 'name',
      options: {
        rules: [
          {
            required: true,
            message: '请输入真实姓名'
          }
        ]
      }
    },
    {
      type: 'birthYear',
      options: {
        rules: [
          {
            required: true,
            message: '请选择您的出生年份'
          }
        ]
      }
    },
    {
      type: 'gender',
      options: {
        initialValue: 'others'
      }
    },
    {
      type: 'studentId',
      options: {
        rules: [
          {
            required: true,
            pattern: new RegExp('^\\d{8}$'),
            message: '学号是8位数字'
          }
        ]
      }
    },
    {
      type: 'address',
      options: {
        rules: [
          {
            required: true,
            message: '请输入地址'
          }
        ]
      }
    }
  ]

  const commonDecorators = {}
  commonFields.forEach(field => {
    commonDecorators[field.type] = getFieldDecorator(field.type, field.options)
  })
  const additionalDecorators = {}
  additionalFields.forEach(field => {
    additionalDecorators[field.type] = getFieldDecorator(
      field.type,
      field.options
    )
  })
  const OrganizationForm = (
    <>
      <Form.Item label="地址">
        {additionalDecorators['address'](<Input />)}
      </Form.Item>
    </>
  )

  const year = new Date().getFullYear()
  const Years = new Array(80).fill(0).map((item, index) => {
    const _year = year - index
    return (
      <Option key={_year} value={_year}>
        {_year}
      </Option>
    )
  })

  const PersonalForm = (
    <>
      <Form.Item label="姓名">
        {additionalDecorators['name'](<Input />)}
      </Form.Item>
      <Form.Item label="出生年份">
        {additionalDecorators['birthYear'](<Select>{Years}</Select>)}
      </Form.Item>
      <Form.Item label="性别">
        {additionalDecorators['gender'](
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="female">女</Radio>
            <Radio value="others">其他</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="学号">
        {additionalDecorators['studentId'](<Input />)}
      </Form.Item>
    </>
  )

  const isOrganization = props.form.getFieldValue('isOrganization')

  const AddtionalForm = isOrganization ? OrganizationForm : PersonalForm

  return (
    <Card title="注册" className="register-card">
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item
          label={
            <span>
              昵称
              <Tooltip title="在社区中显示的名称">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {commonDecorators['nickname'](<Input />)}
        </Form.Item>
        <Form.Item label="密码">
          {commonDecorators['password'](<Input type="password" />)}
        </Form.Item>
        <Form.Item label="确认密码">
          {commonDecorators['confirm'](
            <Input type="password" onBlur={handleConfirmBlur} />
          )}
        </Form.Item>
        <Form.Item label="邮箱">
          {commonDecorators['email'](<Input />)}
        </Form.Item>
        <Form.Item label="电话号码">
          {commonDecorators['phone'](<Input />)}
        </Form.Item>
        <Form.Item label="账号类型">
          {commonDecorators['isOrganization'](
            <Radio.Group>
              <Radio value={false}>个人</Radio>
              <Radio value={true}>组织</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        {AddtionalForm}
        <Form.Item {...tailFormItemLayout}>
          <div style={{ display: 'flex' }}>
            <Link to="/login">已有账号</Link>
            <Button
              className="register-form-button"
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            </div>
        </Form.Item>
      </Form>
    </Card>
  )
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(
  RegistrationForm
)

export default WrappedRegistrationForm
