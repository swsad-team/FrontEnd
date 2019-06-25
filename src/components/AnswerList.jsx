import React, { useState } from 'react'
import { List, Collapse, Radio, Checkbox } from 'antd'
import styles from './AnswerList.module.css'

const Panel = Collapse.Panel

function AnswerList ({ survey, answers, Action }) {
  console.log(survey, answers)
  const [keys, setKeys] = useState([])

  const toItem = (question, answer) => {
    const type = question.type
    if (type === 'fill') {
      return <p>{answer}</p>
    } else if (type === 'single') {
      return <Radio.Group value={answer}>
        {question.options.map(item => <Radio key={item} value={item}>{item}</Radio>)}
      </Radio.Group>
    } else {
      return <Checkbox.Group options={question.options} value={answer} />
    }
  }

  const getAnswerByIndex = index => {
    return (
      <List
        dataSource={answers}
        pagination={{
          pageSize: 5
        }}
        renderItem={item => {
          return (
            <List.Item>
              {String(item.answers[index]) ? (
                toItem(survey[index], item.answers[index])
              ) : (
                <span>未填写</span>
              )}
              <span className={styles.author}>
                {'填写人: 匿名 | '}
                {<Action item={item} />}
              </span>
            </List.Item>
          )
        }}
      />
    )
  }

  const handleChange = key => {
    setKeys(key)
  }

  const Header = ({ item }) => {
    return <h1 className={styles.header}>{item.title}</h1>
  }

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      onChange={handleChange}
      className={styles.answersContainer}
    >
      {survey.map((item, index) => (
        <Panel header={<Header item={item} />} key={item.title}>
          {keys.includes(item.title) && getAnswerByIndex(index)}
        </Panel>
      ))}
    </Collapse>
  )
}

export default AnswerList
