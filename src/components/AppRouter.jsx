import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './HomePage'
import NewTaskPage from './NewTask'
import FillSurveyPage from './FillSurveyPage'
import SurveyAnswerContainer from './SurveyAnswerContainer'
import './AppRouter.css'

const AppRouter = props => {
  return (
    <Switch>
      <Route path="/tasks/new" component={NewTaskPage} />
      <Route path="/tasks/:tid/fill" component={FillSurveyPage} />
      <Route path="/tasks/:tid/info" component={SurveyAnswerContainer} />
      <Route path="/" component={HomePage} />
    </Switch>
  )
}

export default AppRouter
