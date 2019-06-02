import React from 'react'
import { Channel } from '@common/types'

import styles from '../channels.scss'

interface Props {
  channel: Channel
  isSelected: boolean
  selectChannel: (channelID: string) => void
}

class ChannelEntry extends React.Component<Props> {
  render() {
    const { selectChannel, channel, isSelected } = this.props

    return (
      <span
        onClick={() => selectChannel(channel.id)}
        key={channel.id}
        className={`${styles.channel} ${
          isSelected ? styles.selectedChannel : null
        }`}
      >
        <span className={styles.channelText}>#{channel.name}</span>
        {channel.unreadCount > 0 && (
          <span className={styles.unread}>{channel.unreadCount}</span>
        )}
      </span>
    )
  }
}

export default ChannelEntry
