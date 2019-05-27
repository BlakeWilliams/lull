import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
} from 'electron-redux'
import reducers from '../common/reducers'

const rootReducer = combineReducers(reducers)
const initialState = getInitialStateRenderer()

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(forwardToMain, thunk),
)

replayActionRenderer(store)

export type AppState = ReturnType<typeof rootReducer>

export default store
