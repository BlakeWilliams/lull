import React from 'react'
import ReactDOM from 'react-dom'

interface Props {}
interface State {}

class Messages extends React.Component {
  render() {
    const messages = [{ text: 'Hello' }]
    return (
      <div>
        <h1>messages</h1>
        {messages.map(message => (
          <h1>{message.text}</h1>
        ))}
      </div>
    )
  }
}

export default Messages
