import React from 'react'
import TaskListContainer from './TaskListContainer'

function AllTaskList() {
  const filters = ['个人发布', '组织发布', '可参加']
  const sorters = ['悬赏金', '时间']
  const getTaskFunc = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(__tasks__)
      }, 1000)
    })
  return (
    <TaskListContainer
      optFilters={filters}
      optSorters={sorters}
      getTask={getTaskFunc}
    />
  )
}

const __task__ = {
  tid: 1,
  publisher: 2,
  title: '买奶茶',
  description: '买一杯奶茶',
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
for (let i = 0; i < 10; i++) {
  __tasks__.push(__task__)
}

export default AllTaskList
