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
  useEffect(() => {
    if (!login) {
      setUserInfo(initUserInfo)
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
