import React from 'react'
import { connect } from 'react-redux'
import { Server } from '@common/types'
import { AppState } from '@renderer/store'

import styles from './style.scss'

interface Props {
  server: Server
}

class Servers extends React.Component<Props> {
  render() {
    const { server } = this.props

    return (
      <div className={styles.container}>
        <img className={styles.image} src={server.image132} />
        <span className={styles.name}>{server.name}</span>
      </div>
    )
  }
}

const mapStateToProps = function(state: AppState) {
  return {
    server: state.servers.servers[state.servers.selectedServer!],
  }
}

export default connect(mapStateToProps)(Servers)
