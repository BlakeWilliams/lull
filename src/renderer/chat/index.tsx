import React from 'react'
import { connect } from 'react-redux'

import { Team } from '@common/types'
import { AppState } from '@renderer/store'

import Channels from './channels'
import Servers from './servers/index'

import Messages from './messages/index'
import NewMessage from './new-message/index'

import styles from './index.scss'

interface Props {
  team: Team
}
interface State {}

class Chat extends React.Component<Props, State> {
  render() {
    const { team } = this.props

    if (team) {
      return (
        <div className={styles.main}>
          <div className={styles.channelContainer}>
            <Servers />
            <Channels />
          </div>
          <div className={styles.messageContainer}>
            <Messages />
            <NewMessage />
          </div>
        </div>
      )
    } else {
      // TODO better loading
      return <h1>Loading</h1>
    }
  }
}

const mapStateToProps = (state: AppState) => {
  const team = state.teams.teams[state.teams.selectedTeam]

  return { team }
}

export default connect(mapStateToProps)(Chat)
