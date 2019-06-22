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

  export async function getPublishTasks(page, taskInPage, publisher, filters, sort) {
    try {
      const respones = await instance.get(`${prefix}/`, {
        params: {
          page: page,
          per_page: taskInPage,
          publisher: publisher,
          filter: filters,
          sort: sort
        }
      })
      return respones.data
    } catch (error) {
      return error
    }
  }
  
  export async function getParticipateTasks(page, taskInPage, participator, filters, sort) {
    try {
      const respones = await instance.get(`${prefix}/`, {
        params: {
          page: page,
          per_page: taskInPage,
          participator: participator,
          filter: filters,
          sort: sort
        }
      })
      return respones.data
    } catch (error) {
      return error
    }
  }

  export async function getEndedTasks(page, taskInPage, user, filters, sort) {
    try {
      const respones = await instance.get(`${prefix}/`, {
        params: {
          page: page,
          per_page: taskInPage,
          user: user,
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
      return respones.data
    } catch (error) {
      return error
    }
  }

  export async function createTaskWithSurvey(data, survey) {
    try {
      data["question"] = survey
      const respones = await instance.post(`${prefix}/`, data)
      return respones.data
    } catch (error) {
      return error
    }
  }

  export async function participateTask(tid) {
    try {
      const respones = await instance.post(`${prefix}/${tid}/attend/`)
      return respones.data
    } catch (error) {
      return error
    }
  }