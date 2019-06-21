import React from 'react'
import TaskListContainer from './TaskListContainer'
import { taskApi } from '../apis';

function AllTaskList() {
  const getTaskFunc = async (filters, sorter, page) => {
    __tasks__ = await taskApi.getAllTasks(
      page, 
      10, 
      filters.map(val => filtersOption[val]), 
      sortersOption[sorter]
    )
    return __tasks__
  }

  return (
    <TaskListContainer
      optFilters={Object.keys(filtersOption)}
      optSorters={Object.keys(sortersOption)}
      getTask={getTaskFunc}
    />
  )
}

const __task__ = {
  tid: 1,
  publisher: 2,
  title: '买奶茶',
  description: '买一fasfsfadsfasfdfafadsfadafdfafasf杯奶茶',
  isQuestionnaire: 'false',
  startTime: 1560517928893,
  endTime: 1560577998893,
  reward: 2,
  coinPool: 40,
  numOfPeople: 20,
  participants: [1, 2, 3, 4, 5, 6],
  finishers: []
}

let __tasks__ = []

const filtersOption =  {
  个人发布: 'personal',
  组织发布: 'organizational',
  可参加: 'participable'
}
const sortersOption =  {
  悬赏金: 'coin',
  时间: 'time',
}

export default AllTaskList