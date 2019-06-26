import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox, Card, message } from 'antd'
import './LoginForm.css'
import { userApi } from '../apis'
import { UserContext } from '../context'

const LoginForm = props => {
  const [loaded, setLoaded] = useState(false)
  const { userInfo, setUserInfo } = useContext(UserContext)
  const { setLogin } = useContext(UserContext)
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields(async (err, { username, password }) => {
      if (!err) {
        setLoaded(true)
        const response = await userApi.loginUser(username, password)
        setLoaded(false)
        if (response.errorMessage) {
          message.error(response.errorMessage)
        } else {
          localStorage.setItem('JWT_TOKEN', response)
          const { errorMessage, ...userInfo } = await userApi.getUserInfo()
          if (!errorMessage) {
            setUserInfo(userInfo)
          }
          setLogin(true)
          message.success('成功登陆')
        }
      }
    })
  }

  const { getFieldDecorator } = props.form
  return (
    <Card title="登陆" className="login-card">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入邮箱或电话' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="邮箱或电话"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住我</Checkbox>)}
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loaded}
          >
            登陆
          </Button>
          <Link to="/register">注册</Link>
        </Form.Item>
      </Form>
    </Card>
  )
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm)

export default WrappedLoginForm
