import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// global styles
import './styles.scss'

import StatusBar from '@renderer/status-bar'
import Chat from './chat/index'
import store from './store'

// @ts-ignore
window.store = store

ReactDOM.render(
  <Provider store={store}>
    <StatusBar />
    <Chat />
  </Provider>,
  document.getElementById('root'),
)
