import React from 'react'
import Channels from './channels'
import Messages from './messages/index'

import styles from './index.scss'

interface Props {}
interface State {}

class Chat extends React.Component<Props, State> {
  render() {
    const messages = [{ text: 'Hello' }]
    return (
      <div className={styles.main}>
        <Channels />
        <Messages />
      </div>
    )
  }
}

export default Chat
