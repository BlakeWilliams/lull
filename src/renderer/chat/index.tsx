import React from 'react'
import Channels from './channels'
import Messages from './messages'

interface Props {}
interface State {}

class Chat extends React.Component<Props, State> {
  render() {
    const messages = [{ text: 'Hello' }]
    return (
      <div>
        <Channels />
        <Messages />
      </div>
    )
  }
}

export default Chat
