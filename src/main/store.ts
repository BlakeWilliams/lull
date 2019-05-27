import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux'
import reducers from '../common/reducers'

const mainReducer = combineReducers(reducers)

const store = createStore(
  mainReducer,
  {}, // initial state
  applyMiddleware(thunk, forwardToRenderer),
)

replayActionMain(store)

export default store
