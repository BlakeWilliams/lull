import React from 'react'
import { sortBy } from 'lodash'
import { connect } from 'react-redux'
import { Message, Team } from '@common/types'
import { AppState } from '@renderer/store'

import MessageRow from './message-row'
import styles from './style.scss'

interface Props {
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
      this.scrollToBottom()
    }
  }

  componentDidMount() {
    this.scrollToBottom()
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
  const messages = state.messages[selectedChannel] || []

  return {
    messages: sortBy(messages, 'timestamp'),
  }
}

export default connect(mapStateToProps)(Messages)
