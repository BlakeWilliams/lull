import React from 'react'
import { connect } from 'react-redux'

import { Server } from '@common/types'
import { AppState } from '@renderer/store'

import Channels from './channels'
import Servers from './servers/index'

import Messages from './messages/index'
import NewMessage from './new-message/index'

import styles from './index.scss'

interface Props {
  server: Server
}
interface State {}

class Chat extends React.Component<Props, State> {
  render() {
    const { server } = this.props

    console.log(server)

    if (server) {
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
  const server = state.servers.servers[state.servers.selectedServer]

  return { server }
}

export default connect(mapStateToProps)(Chat)
