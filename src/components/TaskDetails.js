import React from 'react'
import { List } from 'antd'
import { isMoment } from 'moment'

function toValue(value, key, typeMap) {
  let res
  if (Array.isArray(value)) {
    if (value.length && typeof value[0] !== 'object') {
      res = value.reduce((str, item) => {
        return (str += `${item}/ `)
      }, '')
      res = res.substr(0, res.length - 2)
    } else {
      res = value.map((item, index) => {
        return toValue(item, index, typeMap)
      })
    }
  } else if (isMoment(value)) {
    res = value.format('YYYY-MM-DD HH:mm')
  } else if (value === !!value) {
    res = String(typeMap[`${key}-${value}`])
  } else if (value !== null && typeof value === 'object') {
    res = <TaskDetails values={value} typeMap={typeMap} key={key} />
  } else {
    res = String(value)
  }
  return res
}

const TaskDetails = props => {
  const { values = {}, typeMap = {} } = props
  const data = Object.keys(values).map(key => {
    return { title: typeMap[key], value: toValue(values[key], key, typeMap) }
  })
  return (
    <List
      dataSource={data}
      bordered
      renderItem={(item, index) => (
        <List.Item>
          {item.title} : {item.value}
        </List.Item>
      )}
    />
  )
}

export default TaskDetails
