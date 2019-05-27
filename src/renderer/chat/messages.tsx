import React from 'react'
import { sortBy } from 'lodash'
import { connect } from 'react-redux'
import { Message } from '@common/types'
import { AppState } from '@renderer/store'

interface Props {
  messages: Message[]
}

class Messages extends React.Component<Props> {
  render() {
    const { messages } = this.props

    return (
      <div>
        {messages.map(message => (
          <p>{message.text}</p>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedChannel = state.servers.selectedChannel
  const messages = state.messages[selectedChannel] || []

  return {
    messages: sortBy(messages, 'timestamp').reverse(),
  }
}

export default connect(mapStateToProps)(Messages)
