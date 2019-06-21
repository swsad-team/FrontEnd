import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 2000,
  withCredentials: true
})

instance.interceptors.request.use(
  config => {
    let authorization = config.headers.authorization || ''
    const jwtToken =  localStorage.getItem('JWT_TOKEN')
    if (jwtToken) {
      authorization += ` Bearer ${jwtToken}`
    }
    return {...config, headers: {...config.headers, authorization}}
  }
)

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
