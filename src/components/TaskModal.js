import React, { useState } from 'react'
import { Modal, Button, message } from 'antd';

const TaskModal = (props) => {
  const { visible, task, setTaskModal } = props

  const [loading, setLoading] = useState(false)

  const handleCancel = () => {
    setTaskModal({visible: false, task})
  }
  const handleOk = async () => {
    setLoading(true)
    // TODO: invoke api
    try {
      await new Promise((resolve, rejcet) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve()
          } else {
            rejcet()
          }
        }, 1000);
      })
      message.success('接受任务成功')
      setTaskModal({visible: false, task})
    } catch (error) {
      message.error('接受任务失败')
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      title={task.title}
      onCancel={handleCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          接受任务
        </Button>,
        <Button key="back" onClick={handleCancel}>
          返回
        </Button>
        
      ]}
    >
      {task.content}
    </Modal>
  )
}

export default TaskModal