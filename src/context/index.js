import React, { createContext, useState, useEffect, useCallback } from 'react'

import { userApi } from '../apis'

const UserContext = createContext({})

export { UserContext }

const delayFetch = {
  timer: null,
  waiting: false,
  waitQuery: [],
  add: function(uid, cb) {
    if (!this.waiting) {
      this.waiting = true
    }
    if (!this.waitQuery.includes(uid)) {
      this.waitQuery.push(uid)
      let t = window.setTimeout(() => {
        this.waiting = false
        cb(this.waitQuery)
        window.setTimeout(() => this.waitQuery = [], 0)
      }, 0)
      window.clearTimeout(this.timer)
      this.timer = t
    }
  }
}

export const UserProvider = props => {
  const {
    login: initLogin = false,
    userInfo: initUserInfo = {},
    children
  } = props
  const [login, setLogin] = useState(initLogin)
  const [userInfo, setUserInfo] = useState(initUserInfo)

  const [userMap, setUserMap] = useState({})
  const [waitToFetch, setWaitToFetch] = useState([])

  useEffect(() => {
    if (!login) {
      setUserInfo(initUserInfo)
    }
  }, [login])

  useCallback(() => {
    userMap[userInfo.uid] = userInfo
  }, [userInfo])

  useEffect(() => {
    let isSubscribe = true
    const fetchUsers = async uids => {
      if (uids.length !== 0) {
        const response = await userApi.getUsers(uids)
        if (response.errorMessage) {
          console.log(response.errorMessage)
        } else if (isSubscribe) {
          const obj = response.reduce((acc, item) => Object.assign(acc, { [item.uid]: item }), {})
          setUserMap({ ...userMap, ...obj })
          setWaitToFetch([])
        }
      }
    }
    if (waitToFetch.length !== 0) {
      fetchUsers(waitToFetch)
    }
    return () => (isSubscribe = false)
  }, [waitToFetch])

  const getUserByUid = uid => {
    if (uid in userMap) {
      return userMap[uid]
    } else {
      delayFetch.add(uid, (v) => setWaitToFetch(v))
      return {}
    }
  }

  const userContext = {
    login,
    setLogin,
    userInfo,
    setUserInfo,
    getUserByUid
  }
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  )
}
