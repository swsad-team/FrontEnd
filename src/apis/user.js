import axios from 'axios'

class UserApi {
  http
  constructor(url) {
    this.http = axios.create({
      baseUrl: url,
      timeout: 2000,
    })
    this.http.interceptors.response.use(function (response) {
      response.success = true
      return response
    }, function (error) {
      return Promise.reject(error.response ? error.response : error.message)
    })
  }

  loginUser = async (userData) => {
    try {
      return await this.http.post('/login', userData)
    } catch (error) {
      return error
    }
  }
}

const userApi = new UserApi('/api/user')

export default userApi