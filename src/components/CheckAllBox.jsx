import React from 'react'
import { Checkbox } from 'antd'

const CheckAllBox = props => {
  const { checkedList, onChange, options, withCheckAll = false } = props

  const indeterminate =
    !!checkedList.length && checkedList.length < options.length
  const checkAll = checkedList.length === options.length

  const handleChange = checkedList => {
    onChange(checkedList)
  }

  const onCheckAllChange = e => {
    onChange(e.target.checked ? options : [])
  }

  return (
    <>
      {withCheckAll && (
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      )}
      <Checkbox.Group
        options={options}
        value={checkedList}
        onChange={handleChange}
      />
    </>
  )
}

export default CheckAllBox
