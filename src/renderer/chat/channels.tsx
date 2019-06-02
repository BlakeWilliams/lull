import React from 'react'
import { connect } from 'react-redux'
import { Channel } from '@common/types'
import { selectChannel } from '@renderer/actions'
import { AppState } from '@renderer/store'

import ChannelEntry from './channels/channel-entry'
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
          <ChannelEntry
            key={channel.id}
            isSelected={channel.id == selectedChannel}
            channel={channel}
            selectChannel={selectChannel}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  const selectedTeam = state.teams.selectedTeam
  const team = state.teams.teams[state.teams.selectedTeam]
  const joinedChannels = Object.values(
    state.conversations[selectedTeam] || [],
  ).filter((channel: Channel) => channel.isChannel && channel.isMember)

  return {
    selectedChannel: team.selectedChannel,
    channels: joinedChannels,
  }
}

export default connect(
  mapStateToProps,
  { selectChannel },
)(Channels)
