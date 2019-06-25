import React, { useContext, useState, useEffect } from 'react'
import {
  Typography,
  Button,
  message,
  Select,
  Radio,
} from 'antd'
import { UserContext } from '../context'
import styles from './UserInfoContainer.module.css'
import { userApi } from '../apis'

const UserInfo = ({ userInfo, editableInfo = {}, onChange }) => {
  const user = { ...userInfo, ...editableInfo }

  const genderMap = {
    male: '男',
    female: '女',
    other: '其他'
  }

  const year = new Date().getFullYear()
  const Years = new Array(80).fill(0).map((item, index) => {
    const _year = year - index
    return (
      <Select.Option key={_year} value={_year}>
        {_year}
      </Select.Option>
    )
  })

  const { isOrganization } = user
  return (
    <div className={styles.container}>
      <h1>
        用户详情<span>({isOrganization ? '组织账号' : '个人账号'})</span>
      </h1>
      <div className={styles.infoContainer}>
        <label>昵称:</label>
        <span>
          <Typography.Text
            editable={{ onChange: v => onChange('name', v.trim()) }}
          >
            {user.name}
          </Typography.Text>
        </span>
        <label>余额:</label>
        <span>{user.coin}</span>
        <label>电话:</label>
        <span>{user.phone}</span>
        <label>邮箱:</label>
        <span>{user.email}</span>
        {!isOrganization ? (
          <>
            <label>真实姓名:</label>
            <span>
              <Typography.Text
                editable={{ onChange: v => onChange('realname', v.trim()) }}
              >
                {user.realname}
              </Typography.Text>
            </span>
            <label>学号:</label>
            <span>{user.studentID}</span>
            <label>性别:</label>
            <span>
              <Radio.Group
                value={user.gender}
                onChange={e => onChange('gender', e.target.value)}
              >
                {Object.entries(genderMap).map(([key, value]) => (
                  <Radio key={key} value={key}>
                    {value}
                  </Radio>
                ))}
              </Radio.Group>
            </span>
            <label>出生年份:</label>
            <span>
              <Select
                value={user.birthYear}
                onChange={v => onChange('birthYear', v)}
              >
                {Years}
              </Select>
            </span>
          </>
        ) : (
          <>
            <label>地址:</label>
            <span>
              <Typography.Paragraph
                editable={{ onChange: v => onChange('address', v.trim()) }}
              >
                {user.address}
              </Typography.Paragraph>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

const validators = {
  address: v => {
    return !!v
  },
  name: v => {
    return !!v
  },
  realname: v => {
    return !!v
  }
}

const UserInfoContainer = ({ history }) => {
  const { userInfo, setUserInfo } = useContext(UserContext)
  const [editableInfo, setEditableInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isSubscribe = true
    userApi.getUserInfo().then(({ errorMessage, ...userInfo }) => {
      if (isSubscribe && !errorMessage) {
        setUserInfo(userInfo)
      }
    })
    return () => (isSubscribe = false)
  }, [])

  const handleChange = (key, v) => {
    if (!(key in validators) || validators[key](v)) {
      setEditableInfo({
        ...editableInfo,
        [key]: v
      })
    } else {
      message.error('格式错误')
    }
  }

  const handleUserInfoChange = async () => {
    setIsLoading(true)
    const { errorMessage, ...newUserInfo } = await userApi.updateUserInfo(
      userInfo.uid,
      editableInfo
    )
    if (errorMessage) {
      message.error(errorMessage)
    } else {
      message.success('修改成功')
      setEditableInfo({})
      setUserInfo(newUserInfo)
    }
    setIsLoading(false)
  }

  return (
    <div>
      <UserInfo
        userInfo={userInfo}
        editableInfo={editableInfo}
        onChange={handleChange}
      />
      <div className={styles.bottomBar}>
        <Button
          type="primary"
          disabled={Object.keys(editableInfo).length === 0}
          onClick={handleUserInfoChange}
          loading={isLoading}
        >
          保存
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </div>
    </div>
  )
}

export default UserInfoContainer
