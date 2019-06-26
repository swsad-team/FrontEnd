import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 2000,
  withCredentials: true
})

instance.interceptors.request.use(config => {
  let authorization = config.headers.authorization || ''
  const jwtToken = localStorage.getItem('JWT_TOKEN')
  if (jwtToken) {
    authorization += ` Bearer ${jwtToken}`
  }
  return { ...config, headers: { ...config.headers, authorization } }
})

instance.interceptors.response.use(
  res => {
    return res
  },
  error => {
    const msg =
      (error.response ? messages[error.response.data] : error.Message) ||
      '未定义错误'
    return Promise.reject({ errorMessage: msg })
  }
)

const messages = {
  TASK_NOT_FOUND: '未找到任务',
  NOT_PUBLISHER: '只允许发起者操作',
  TASK_NOT_VALID: '任务已失效',
  EXIST_USER_NOT_FINISHED: '还有未完成的用户',
  NOT_QUESTIONNAIRE: '只能对问卷进行此操作',
  INVALID_REWARD: '奖金不合法',
  COIN_NOT_ENOUGH: '余额不足',
  USER_IS_PUBLISHER: '发起者不能参加任务',
  ALREADY_ATTEND: '不能重复参加任务',
  TASK_IS_END: '任务已经结束',
  USER_NOT_IN_TASK: '未参与该任务',
  ANSWER_EXISTS: '已经提交过问卷',
  INVALID_ANSWER: '答案不合法',
  TARGET_USER_NOT_FOUND: '未找到用户',
  TARGET_USER_NOT_IN_TASK: '目标用户未参加任务'
}
export default instance
