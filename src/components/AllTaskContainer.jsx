import { Button, Icon, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import TaskFilter from './TaskFilter'
import TaskList from './TaskList'
import { resolve } from 'upath'
import styles from './AllTaskContainer.module.css'

function TaskListContiner() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([])
  const [sorter, setSorter] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let isSubscribed = true
    setLoading(true)
    new Promise(resolve => {
      setTimeout(() => resolve(__tasks__), 1000)
    }).then(t => {
      if (isSubscribed) {
        setTasks(t)
        setLoading(false)
      }
    })
    return () => {
      isSubscribed = false
    }
  }, [page])
  const headerZone = (
    <div className={styles.header}>
      <TaskFilter
        filters={__fakeFilter.map(f => f.name)}
        sorts={__fakeSorts__.map(s => s.name)}
        selectedFilters={filters}
        selectedSort={sorter}
        onChange={({ filters, sort }) => {
          console.log(filters, sort)
          setFilters(filters)
          setSorter(sort)
        }}
      />
    </div>
  )
  const paginationZone = (
    <div className={styles.pagination}>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        上一页
      </Button>
      <Button onClick={() => setPage(page + 1)}>下一页</Button>
    </div>
  )
  return (
    <div className={styles.content}>
      {headerZone}
      {loading ? <Skeleton /> : <TaskList tasks={tasks} />}
      {paginationZone}
    </div>
  )
}

const __fakeFilter = [
  {
    name: '个人',
    filter: task => !task.origin.isOrganization
  },
  {
    name: '组织',
    filter: task => task.origin.isOrganization
  },
  {
    name: '可参加',
    filter: () => true // TODO:
  }
]

const __fakeSorts__ = [
  {
    name: '时间',
    sort: (task1, task2) => true
  },
  {
    name: '金额',
    sort: (t1, t2) => true
  }
]

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
  participants: [],
  finishers: []
}

let __tasks__ = []
for (let i = 0; i < 10; i++) {
  __tasks__.push(__task__)
}

export default TaskListContiner
