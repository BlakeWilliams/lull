import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './styles.scss'

import Chat from './chat/index'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Chat />
  </Provider>,
  document.getElementById('root'),
)
