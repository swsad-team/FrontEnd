import instance from './instance'

const prefix = '/users'

/**
 * 用户登陆
 * @param {String} phoneOrEmail 
 * @param {String} password 
 */
export async function loginUser(phoneOrEmail, password) {
  try {
    const respones = await instance.post(`${prefix}/login`, {
      phoneOrEmail,
      password
    })
    return respones.data
  } catch (error) {
    return error
  }
}

export async function getUserInfo(userId = 0) {
  const id = userId ? userId : ''
  try {
    const respones = await instance.get(`${prefix}/${id}`)
    return respones.data
  } catch (error) {
    return null
  }
}
