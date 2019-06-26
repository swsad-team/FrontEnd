import React, { useState, useEffect } from 'react'
import { Pagination, Skeleton, Radio, Modal, Button, message } from 'antd'
import SurveyWithAnswer from './SurveyWithAnswer'
import styles from './SurveyAnswerContainer.module.css'
import AnswerList from './AnswerList'
import { taskApi } from '../apis'

const displayTypes = ['问卷', '问题', '统计']

const SurveyAnswerContainer = ({ tid }) => {
  const [isLoading, setIsLoaing] = useState(true)
  const [survey, setSurvey] = useState([])
  const [answers, setAnswers] = useState([])
  const [displayType, setDisplayType] = useState(displayTypes[0])

  useEffect(() => {
    let isSubscribed = true
    setIsLoaing(true)
    const fetchSurveyAndAnswers = async tid => {
      const [survey, answers] = await Promise.all([
        taskApi.getSurveyOfTask(tid),
        taskApi.getAnswersOfTask(tid)
      ])
      if (survey.errorMessage || answers.errorMessage) {
        survey.errorMessage && message.error(survey.errorMessage)
        answers.errorMessage && message.error(answers.errorMessage)
      } else if (isSubscribed) {
        setSurvey(survey)
        setAnswers(answers)
      }
      setIsLoaing(false)
    }
    fetchSurveyAndAnswers(tid)
    return () => (isSubscribed = false)
  }, [tid])

  const DisplaySurvey = () => {
    const [page, setPage] = useState(1)
    const handlePageChange = page => {
      setPage(page)
    }
    return (
      <>
        <SurveyWithAnswer survey={survey} answer={answers[page - 1]} />
        <Pagination
          className={styles.pagination}
          pageSize={1}
          current={page}
          onChange={handlePageChange}
          total={answers.length}
        />
      </>
    )
  }

  const DisplayAnswers = () => {
    const [visible, setVisible] = useState(false)
    const [viewAnswer, setViewAnswer] = useState({})
    const handleView = item => {
      setViewAnswer(item)
      setVisible(true)
    }

    const Action = ({ item }) => (
      <Button type="link" onClick={() => handleView(item)}>
        查看问卷
      </Button>
    )
    return (
      <>
        <AnswerList survey={survey} answers={answers} Action={Action} />
        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={
            <Button
              type="primary"
              onClick={() => {
                setVisible(false)
              }}
            >
              返回
            </Button>
          }
          title={null}
        >
          <SurveyWithAnswer survey={survey} answer={viewAnswer} />
        </Modal>
      </>
    )
  }

  const displayMap = {
    问卷: () => <DisplaySurvey />,
    问题: () => <DisplayAnswers />
  }

  const TypeSelete = ({ value, onChange }) => {
    return (
      <div className={styles.topSelete}>
        <label>显示类型: </label>
        <Radio.Group value={value}>
          {displayTypes.map(item => (
            <Radio
              value={item}
              key={item}
              onChange={e => onChange(e.target.value)}
            >
              {item}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    )
  }

  return (
    <div className={`${styles.container} container`}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <TypeSelete value={displayType} onChange={v => setDisplayType(v)} />
          {displayMap[displayType] && displayMap[displayType]()}
        </>
      )}
    </div>
  )
}

export default SurveyAnswerContainer
