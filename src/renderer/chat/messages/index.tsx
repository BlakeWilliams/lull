import React from 'react'
import { sortBy } from 'lodash'
import { connect } from 'react-redux'
import { Message, Team, Channel } from '@common/types'
import { AppState } from '@renderer/store'

import MessageRow from './message-row'
import styles from './style.scss'
import { sendReadMarker, fetchMessages } from '@renderer/slack-commands'

interface Props {
  channel: Channel
  messages: Message[]
}

class Messages extends React.Component<Props> {
  atScrollBottom = true
  scrollWindow = React.createRef<HTMLDivElement>()

  scrollToBottom = () => {
    const scrollWindow = this.scrollWindow.current
    const scrollHeight = scrollWindow.scrollHeight
    const height = scrollWindow.clientHeight
    const maxScroll = scrollHeight - height

    scrollWindow.scrollTop = maxScroll > 0 ? maxScroll : 0
  }

  componentDidUpdate() {
    if (this.atScrollBottom) {
      this.updateReadStatus()
      this.scrollToBottom()
    }
  }

  componentDidMount() {
    this.updateReadStatus()
    this.scrollToBottom()
  }

  updateReadStatus() {
    const { channel } = this.props

    if (channel && channel.unreadCount > 0) {
      sendReadMarker(channel.id)
    }
  }

  getSnapshotBeforeUpdate(): any {
    // TODO check if we're already at the bottom of the file, if so we can
    // scroll. If not, we don't want to interrupt the users scrolling
    return null
  }

  render() {
    const { messages } = this.props

    let owner: string | null = null

    return (
      <div className={styles.container} ref={this.scrollWindow}>
        {messages.map((message, index) => {
          let previousOwner = owner
          owner = message.userID

          return (
            <MessageRow
              key={message.id}
              message={message}
              consecutiveOwner={owner === previousOwner}
            />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedTeam = state.teams.selectedTeam!
  const selectedChannel = state.teams.teams[selectedTeam].selectedChannel
  const messages = Object.values(state.messages[selectedChannel] || {}) || []

  return {
    channel: state.channels[selectedTeam][selectedChannel],
    messages: sortBy(messages, 'timestamp'),
  }
}

export default connect(mapStateToProps)(Messages)
