import { shell } from 'electron'
import React from 'react'
import { connect } from 'react-redux'
import { Message, User } from '@common/types'
import { AppState } from '@renderer/store'
import store from '@renderer/store'

import styles from './style.scss'

interface OwnProps {
  sameOwnerAsPreviousMessage: boolean
  message: Message
}

interface DispatchProps {
  user: User
}
const uriRegex = new RegExp('<http.*?>', 'g')

// TODO move to when we receive the message to cache it?
const formatMessage = (text: string): string => {
  let inCode = false
  const teamID = store.getState().teams.selectedTeam
  const users = store.getState().users[teamID]

  return text
    .split('\n')
    .map((row: string) => {
      if (inCode && row.trim().endsWith('```')) {
        inCode = false
        return '</pre></code>'
      } else if (!inCode && row.trim().startsWith('```')) {
        inCode = true
        return `<code><pre><div>${row.substr(3)}</div>`
      } else if (inCode) {
        return `<div>${row}</div>`
      } else {
        return (
          row
            // .replace(/`.*?`/g, function(match: string) {
            //   return `<code class="${
            //     styles.inline
            //   }">${match.substr(1, match.length - 2)}</code>`
            // })
            .replace(/<@.*?>/g, function(match: string) {
              const user = users[match.substr(2, match.length - 3)]
              return `<span class="${
                styles.user
              }">@${user.displayName || user.realName || user.name || 'unknown'}</span>`
            })
            .replace(uriRegex, function(match: string) {
              const [text, label]: string[] = match
                .substr(1, match.length - 2)
                .split('|')

              return `<a href="${text}" target="_blank">${label || text}</a>`
            })
        )
      }
    })
    .join('')
}

class MessageRow extends React.Component<OwnProps & DispatchProps> {
  render() {
    const { message, sameOwnerAsPreviousMessage, user } = this.props
    const name = user.displayName || user.name || user.realName

    if (message.subtype === 'channel_join') {
      return (
        <div className={styles.messageRow}>
          <div className={styles.imgContainer} />
          <span>@{name} has joined</span>
        </div>
      )
    } else if (message.subtype === 'channel_leave') {
      return (
        <div className={styles.messageRow}>
          <div className={styles.imgContainer} />
          <span>@{name} has left</span>
        </div>
      )
    } else {
      return (
        <div
          className={`${styles.messageRow} ${
            sameOwnerAsPreviousMessage ? styles.sameOwner : ''
          }`}
        >
          <div className={styles.imgContainer}>
            {sameOwnerAsPreviousMessage ? null : <img src={user.image72} />}
          </div>

          <div className={styles.textContainer}>
            {sameOwnerAsPreviousMessage ? null : (
              <span className={styles.name}>{name}</span>
            )}

            <span
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
            />
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const teamID = state.teams.selectedTeam
  const userID = ownProps.message.userID

  return {
    user: state.users[teamID][userID],
  }
}

export default connect(mapStateToProps)(MessageRow)
