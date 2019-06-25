import instance from './instance'

const prefix = '/tasks'

export async function getTaskById(tid) {
  try {
    const response = await instance.get(`${prefix}/${tid}`)
    return response.data
  } catch (error) {
    return error
  }
}

export async function getAllValidTasks(page, taskInPage, filters, sort) {
  try {
    const response = await instance.get(prefix, {
      params: {
        page: page,
        per_page: taskInPage,
        filter: [...filters, 'valid'],
        sort: sort,
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function getPublishTasks(page, taskInPage, filters, sort) {
  try {
    const response = await instance.get(prefix, {
      params: {
        page: page,
        per_page: taskInPage,
        filter: [...filters, 'publish', 'valid'],
        sort: sort,
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function getParticipateTasks(page, taskInPage, filters, sort) {
  try {
    const response = await instance.get(prefix, {
      params: {
        page: page,
        per_page: taskInPage,
        filter: [...filters, 'participate', 'valid'],
        sort: sort,
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function getEndedTasks(page, taskInPage, filters, sort, user) {
  try {
    const response = await instance.get(prefix, {
      params: {
        page: page,
        per_page: taskInPage,
        user: user,
        filter: [...filters, 'over'],
        sort: sort,
      },
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function createTask(data) {
  try {
    const response = await instance.post(prefix, data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function getSurveyOfTask(tid) {
  try {
    const response = await instance.get(`${prefix}/${tid}/questionnaire`)
    return response.data
  } catch (error) {
    return error
  }
}

export async function getAnswersOfTask(tid) {
  try {
    const response = await instance.get(`${prefix}/${tid}/answers`)
    return response.data
  } catch (error) {
    return error
  }
}

export async function createTaskWithSurvey(data, survey) {
  try {
    const response = await instance.post(prefix, {
      ...data,
      question: survey,
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function participateTask(tid) {
  try {
    const response = await instance.post(`${prefix}/${tid}/attend`)
    return response.data
  } catch (error) {
    return error
  }
}

export async function finishSurvey(tid, answers) {
  try {
    const response = await instance.post(`${prefix}/${tid}/finish`, answers)
    return response.data
  } catch (error) {
    return error
  }
}
export async function finishTask(tid, targetUid) {
  try {
    const response = await instance.post(`${prefix}/${tid}/finish`, {
      user: targetUid,
    })
    return response.data
  } catch (error) {
    return error
  }
}

export async function cancelTask(tid) {
  try {
    const response = await instance.post(`${prefix}/${tid}/cancel`)
    return response.data
  } catch (error) {
    return error
  }
}
