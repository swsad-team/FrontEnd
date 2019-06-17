import React from 'react'
import { Radio, Checkbox, Form } from 'antd'

import styles from './SurveyWithAnswer.module.css'

const SurveyWithAnswer = ({ survey, answer }) => {
  const toAnswer = (question, answer) => {

    const itemMap = {
      radio: () => (
        <Radio.Group value={answer}>
          {question.options.map(item => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      ),
      multyCheck: () => (
        <Checkbox.Group value={answer} options={question.options} />
      ),
      text: () => <p className={styles.text}> {answer || '未填写'}</p>
    }

    return (
      <Form.Item
        className={styles.formItem}
        key={question.title}
        label={question.title}
      >
        {itemMap[question.type]()}
      </Form.Item>
    )
  }

  return (
    <div className={styles.formContainer}>
      <h1>{'填写人: 匿名'}</h1>
      {survey.map((item, index) => (
        toAnswer(item, answer.content[index])
      ))}
    </div>
  )
}

export default SurveyWithAnswer
