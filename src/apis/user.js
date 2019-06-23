import instance from './instance'
import jwt from 'jsonwebtoken'

const prefix = '/users'

/**
 * 用户登陆
 * @param {String} phoneOrEmail 
 * @param {String} password 
 */
export async function loginUser(phoneOrEmail, password) {
  try {
    const respones = await instance.post(`${prefix}/login`, {
      account: phoneOrEmail,
      password
    })
    return respones.data
  } catch (error) {
    return error
  }
}


export async function registerUser(data) {
  try {
    const respones = await instance.post(`${prefix}/`, data)
    return respones.data
  } catch (e) {
    return e
  }
}

export async function signOutUser() {
  localStorage.removeItem('JWT_TOKEN')
  return true
}

export async function getUserInfo () {
  const token = localStorage.getItem('JWT_TOKEN')
  const payload = token && jwt.decode(token)
  if (payload && 'uid' in payload) {
    try {
      const response = await instance.get(`${prefix}/${payload.uid}`)
      return response.data
    } catch (error) {
      return error
    }
  } else {
    return {}
  }
}
