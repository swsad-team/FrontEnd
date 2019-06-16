import React, { useState, useEffect } from 'react'
import {
  Pagination,
  Skeleton,
  Select,
  Radio,
  Divider,
  Modal,
  Button
} from 'antd'
import SurveyWithAnswer from './SurveyWithAnswer'
import styles from './SurveyAnswerContainer.module.css'
import AnswerList from './AnswerList'

const displayTypes = ['问卷', '问题', '统计']

const SurveyAnswerContainer = () => {
  const [isLoading, setIsLoaing] = useState(true)
  const [survey, setSurvey] = useState([])
  const [answers, setAnswers] = useState([])

  const [displayType, setDisplayType] = useState(displayTypes[0])
  useEffect(() => {
    let isSubscribed = true
    setIsLoaing(true)
    new Promise(resolve => {
      setTimeout(resolve, 1000)
    }).then(() => {
      if (isSubscribed) {
        setSurvey(fakeSurvey)
        setAnswers(fakeAnswers)
        setIsLoaing(false)
      }
    })
    return () => (isSubscribed = false)
  }, [])

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
    <div className={styles.container}>
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

const fakeSurvey = [
  {
    title: 'radio 1',
    isRequired: true,
    type: 'radio',
    options: ['1', '2', '3']
  },
  {
    title: 'check 1',
    isRequired: true,
    type: 'multyCheck',
    options: ['1', '2', '3']
  },
  {
    title: 'text 1',
    isRequired: true,
    type: 'text',
    options: []
  },
  {
    title: 'radio 2',
    isRequired: false,
    type: 'radio',
    options: ['1', '2', '3']
  },
  {
    title: 'check 2',
    isRequired: false,
    type: 'multyCheck',
    options: ['1', '2', '3', '4']
  },
  {
    title: 'text 2',
    isRequired: false,
    type: 'text',
    options: []
  }
]

const fakeAnswers = [
  {
    uid: 0,
    content: ['1', ['1', '2'], 'text......', '2', [], 'text2.....']
  },
  {
    uid: 1,
    content: ['2', ['1', '2'], 'text......', '2', [], 'text2.....']
  },
  {
    uid: 2,
    content: ['1', ['1', '2'], 'text......', '2', ['2', '4'], '']
  }
]

export default SurveyAnswerContainer
