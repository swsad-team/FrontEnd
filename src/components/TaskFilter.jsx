import { Checkbox, Select } from 'antd'

import PropTypes from 'prop-types'
import React from 'react'
import styles from './TaskFilter.module.css'

const Option = Select.Option

function TaskFilter({
  filters = [],
  sorts = [],
  selectedFilters = [],
  selectedSort = null,
  onChange
}) {
  const handleChange = ({ f = selectedFilters, s = selectedSort }) => {
    onChange({
      filters: f,
      sort: s
    })
  }
  const checkZone = (
    <>
      {filters.map((val, i) => (
        <Checkbox
          className={styles.checkBox}
          key={i}
          checked={selectedFilters.includes(val)}
          onChange={e => {
            if (e.target.checked) {
              handleChange({
                f: selectedFilters.concat(val)
              })
            } else {
              handleChange({
                f: selectedFilters.filter(v => v !== val)
              })
            }
          }}
        >
          {val}
        </Checkbox>
      ))}
    </>
  )
  const selector = (
    <div>
      排序：
      <Select
        className={styles.selector}
        onChange={val => {
          handleChange({
            s: val
          })
        }}
      >
        {sorts.map((val, i) => (
          <Option key={i} value={val}>
            {val}
          </Option>
        ))}
      </Select>
    </div>
  )
  return (
    <div className={styles.content}>
      {filters.length !== 0 ? checkZone : null}
      {sorts.length !== 0 ? selector : null}
    </div>
  )
}

TaskFilter.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string),
  sorts: PropTypes.arrayOf(PropTypes.string),
  selectedFilters: PropTypes.arrayOf(PropTypes.string),
  selectedSort: PropTypes.string
}

export default TaskFilter
