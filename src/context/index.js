import React, { createContext, useState } from 'react'

export const UserContext = createContext({})

export const UserProvider = props => {
  const { login: initLogin = true, nickname: initNickname, children } = props
  const [login, setLogin] = useState(initLogin)
  const [nickname, setNickname] = useState(initNickname)

  const userContext = {
    login,
    setLogin,
    nickname,
    setNickname
  }
  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  )
}
