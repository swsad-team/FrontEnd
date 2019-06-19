import React, { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({})

export const UserProvider = props => {
  const {
    login: initLogin = false,
    userInfo: initUserInfo = {},
    children
  } = props
  const [login, setLogin] = useState(initLogin)
  const [userInfo, setUserInfo] = useState(initUserInfo)
  console.log(login, userInfo)
  useEffect(() => {
    let isSubscribe = true
    if (login) {
      // TODO: get user info
      setUserInfo({ uid: 5, name: 'dengzijie' })
    } else {
      setUserInfo(initUserInfo)
    }

    return () => {
      isSubscribe = false
    }
  }, [login])
  const userContext = {
    login,
    setLogin,
    userInfo,
    setUserInfo
  }
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  )
}
