import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox, Card } from 'antd'
import './LoginForm.css'
import { userApi } from '../apis'
import { UserContext } from '../context';

const LoginForm = props => {
  const [loaded, setLoaded] = useState(false)
  const {setLogin} = useContext(UserContext)
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields(async (err, {username, password}) => {
      if (!err) {
        setLoaded(false)
        const data = await userApi.loginUser(username, password)
        if (data) {
          setLogin(true)
        }
        setLoaded(true)
      } else {

      }
    })
  }

  const { getFieldDecorator } = props.form
  return (
    <Card title="登陆" className="login-card">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入邮箱或电话' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="邮箱或电话"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
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
            initialValue: true
          })(<Checkbox>记住我</Checkbox>)}
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
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
