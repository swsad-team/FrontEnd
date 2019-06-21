import instance from './instance'

const prefix = '/tasks'

export async function getAllTasks(page, taskInPage, filters, sort) {
    try {
      const respones = await instance.get(`${prefix}/`, {
        params: {
          page: page,
          per_page: taskInPage,
          filter: filters,
          sort: sort
        }
      })
      return respones.data
    } catch (error) {
      return error
    }
  }
  
  
  export async function createTask(data) {
    try {
      const respones = await instance.post(`${prefix}/`, data)
      console.log('createTask')
      return respones.data
    } catch (error) {
      return error
    }
  }