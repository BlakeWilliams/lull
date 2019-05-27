import React from 'react'
import { connect } from 'react-redux'
import { Channel } from '@common/types'
import { selectChannel } from '@renderer/actions'
import { AppState } from '@renderer/store'

import styles from './channels.scss'

interface Props {
  selectChannel: typeof selectChannel
  selectedChannel: string
  channels: Channel[]
}

class Channels extends React.Component<Props> {
  render() {
    const { selectedChannel, selectChannel, channels } = this.props

    return (
      <div className={styles.channels}>
        {channels.map(channel => (
          <span
            onClick={() => selectChannel(channel.id)}
            key={channel.id}
            className={`${styles.channel} ${
              channel.id === selectedChannel ? styles.selectedChannel : null
            }`}
          >
            #{channel.name}
          </span>
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  const server = state.servers.servers[state.servers.selectedServer]

  return {
    selectedChannel: server.selectedChannel,
    channels: Object.values(server.channels),
  }
}

export default connect(
  mapStateToProps,
  { selectChannel },
)(Channels)
