import { Button, Icon, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import TaskFilter from './TaskFilter'
import TaskList from './TaskList'
import styles from './TaskListContainer.module.css'

function TaskListContiner({ optFilters, optSorters, getTask }) {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([])
  const [sorter, setSorter] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(null)

  useEffect(() => {
    let isSubscribed = true
    setLoading(true)
    getTask(filters, sorter, page).then(tasks => {
      if (isSubscribed) {
        setTasks(tasks)
        setLoading(false)
      }
    })
    return () => {
      isSubscribed = false
    }
  }, [page, filters, sorter, reload])
  useEffect(() => {
    setPage(1)
  }, [filters, sorter])
  const reloadButton = (
    <Icon
      spin={reload !== null && loading}
      onClick={() => setReload({})}
      type="reload"
    />
  )

  const headerZone = (
    <div className={styles.header}>
      <TaskFilter
        filters={optFilters}
        sorts={optSorters}
        selectedFilters={filters}
        selectedSort={sorter}
        onChange={({ filters, sort }) => {
          console.log(filters, sort)
          setFilters(filters)
          setSorter(sort)
        }}
      />
      {reloadButton}
    </div>
  )
  const paginationZone = (
    <div className={styles.pagination}>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
        上一页
      </Button>
      {`第${page}页`}
      <Button onClick={() => setPage(page + 1)}>下一页</Button>
    </div>
  )
  return (
    <div className={styles.content}>
      {headerZone}
      {loading ? (
        Array(10).fill(
          <div className={styles.skeletonItem}>
            <Skeleton title={{ width: '90%' }} paragraph={false} />
          </div>
        )
      ) : (
        <TaskList tasks={tasks} />
      )}
      {paginationZone}
    </div>
  )
}

TaskListContiner.propTypes = {
  optFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  optSorters: PropTypes.arrayOf(PropTypes.string).isRequired,
  getTask: PropTypes.func.isRequired
}

export default TaskListContiner