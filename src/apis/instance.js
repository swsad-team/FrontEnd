import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 2000,
  withCredentials: true
})

instance.interceptors.response.use(
  res => {
    console.log('success', res)
    return res
  },
  error => {
    console.log('error', error.response)
    const msg = (error.response ? error.response.data : error.Message) || '未定义错误'
    return Promise.reject({errorMessage: msg })
  }
)

export default instance
