import React from 'react'
import Channels from './channels'
import Messages from './messages/index'
import NewMessage from './new-message/index'

import styles from './index.scss'

interface Props {}
interface State {}

class Chat extends React.Component<Props, State> {
  render() {
    return (
      <div className={styles.main}>
        <Channels />
        <div className={styles.messageContainer}>
          <Messages />
          <NewMessage />
        </div>
      </div>
    )
  }
}

export default Chat
