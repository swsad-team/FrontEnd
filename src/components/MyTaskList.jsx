import React from 'react'
import TaskListContainer from './TaskListContainer'
import { taskApi } from '../apis'

export function MyTaskList_Publish() {
  const filtersOption = {
    问卷: 'questionnaire',
    任务: 'mission',
  }
  const getTaskFunc = async (filters, sorter, page) => {
    return await taskApi.getPublishTasks(
      page,
      10,
      filters.map(val => filtersOption[val]),
      sortersOption[sorter]
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

export function MyTaskList_Join() {
  const filtersOption = {
    个人发布: 'personal',
    组织发布: 'organizational',
    问卷: 'questionnaire',
    任务: 'mission',
    待确认: 'waitConfirm',
  }
  const getTaskFunc = async (filters, sorter, page) => {
    return await taskApi.getParticipateTasks(
      page,
      10,
      filters.map(val => filtersOption[val]),
      sortersOption[sorter]
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
export function MyTaskList_Over() {
  const getTaskFunc = async (filters, sorter, page) => {
    return await taskApi.getEndedTasks(
      page,
      10,
      filters.map(val => filtersOption[val]),
      sortersOption[sorter]
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

const filtersOption = {
  个人发布: 'personal',
  组织发布: 'organizational',
  可参加: 'participable',
}
const sortersOption = {
  开始时间: 'startTime',
  悬赏金: 'coin',
  结束时间: 'endTime',
}
