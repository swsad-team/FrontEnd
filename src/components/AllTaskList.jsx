import React from 'react'
import TaskListContainer from './TaskListContainer'
import { taskApi } from '../apis'
function AllTaskList() {
  const getTaskFunc = async (filters, sort, page) => {
    return taskApi.getAllValidTasks(
      page,
      10,
      filters.map(val => filtersOption[val]),
      sortersOption[sort]
    )
  }
  return (
    <TaskListContainer
      optFilters={Object.keys(filtersOption)}
      optSorters={Object.keys(sortersOption)}
      getTask={getTaskFunc}
    />
  )
}

const sortersOption = {
  悬赏金: 'coin',
  时间: 'time',
}
const filtersOption = {
  个人发布: 'personal',
  组织发布: 'organizational',
  可参加: 'participable',
  问卷: 'questionnaire',
  任务: 'mission',
}

export default AllTaskList
