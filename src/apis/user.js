import instance from './instance'

const prefix = 'api/users'

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

export async function getUserInfo(userId = 2) {
  const id = userId ? userId : ''
  try {
    const respones = await instance.get(`${prefix}/${id}`)
    console.log()
    return respones.data
  } catch (error) {
    return null
  }
}
