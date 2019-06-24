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

/**
 * 
 * @param {Object} data 用户登陆数据
 */
export async function registerUser(data) {
  try {
    const respones = await instance.post(`${prefix}/`, data)
    return respones.data
  } catch (e) {
    return e
  }
}

/**
 * 登出, 删除jwt
 */
export async function signOutUser() {
  localStorage.removeItem('JWT_TOKEN')
  return true
}


/**
 * 获得当前登陆用户数据
 */
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

/**
 * 获取一组用户数据
 * @param {Array} uids 要获取的用户的id的数组
 */
export async function getUsers(uids) {
  try {
    const query = uids.map(uid => `uid[]=${uid}`).join('&&')
    const response = await instance.get(`${prefix}/?${query}`)
    return response.data
  } catch (error) {
    return error
  }
}
