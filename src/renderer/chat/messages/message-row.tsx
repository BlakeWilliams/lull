import React from 'react'
import { connect } from 'react-redux'
import { Message, User } from '@common/types'
import { AppState } from '@renderer/store'

import styles from './style.scss'

interface OwnProps {
  sameOwnerAsPreviousMessage: boolean
  message: Message
}

interface DispatchProps {
  user: User
}

class MessageRow extends React.Component<OwnProps & DispatchProps> {
  render() {
    const { message, sameOwnerAsPreviousMessage, user } = this.props

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
            <span className={styles.name}>
              {user.displayName || user.name || user.realName}
            </span>
          )}

          {message.text.split('\n').map(text => (
            <span className={styles.text}>{text}</span>
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const userID = ownProps.message.userID

  return {
    user: state.users[state.servers.id][userID],
  }
}

export default connect(mapStateToProps)(MessageRow)
