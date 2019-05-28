import store from './store'

import {
  ADD_TEAM,
  ADD_CHANNEL,
  AddTeamAction,
  ADD_MESSAGE,
  ADD_USER,
  Channel,
} from '@common/types'
import TeamConnection from './team-connection'

export function addTeam(rtmData: any, teamInfo: any) {
  console.log(rtmData)
  const action: AddTeamAction = {
    type: ADD_TEAM,
    payload: {
      id: rtmData.team.id,
      name: rtmData.team.name,
      domain: rtmData.team.domain,
      image132: teamInfo.icon.image_132,
      channels: {},
      self: {
        id: rtmData.self.id,
        name: rtmData.self.name,
      },
    },
  }

  store.dispatch(action)
}

export async function addChannel(
  teamConnection: TeamConnection,
  rawChannel: any,
) {
  const channel: Channel = {
    id: rawChannel.id,
    name: rawChannel.name,
    topic: rawChannel.topic.value,
    isChannel: rawChannel.is_channel || true,
  }

  if (rawChannel.is_member) {
    const info = await teamConnection.webClient.channels.info({
      channel: channel.id,
    })

    channel.lastRead = new Date(info.channel.last_read * 1000)

    store.dispatch({
      type: ADD_CHANNEL,
      payload: {
        teamID: teamConnection.id,
        channel,
      },
    })
  }
}

export function addMessage(channelID: string, rawMessage: any) {
  const message = {
    id: channelID + rawMessage.ts,
    text: rawMessage.text,
    userID: rawMessage.user,
    subtype: rawMessage.subtype,
    timestamp: new Date(rawMessage.ts * 1000),
  }
  store.dispatch({
    type: ADD_MESSAGE,
    payload: {
      channelID,
      message,
    },
  })
}

export function addUser(rawUser: any) {
  store.dispatch({
    type: ADD_USER,
    payload: {
      teamID: rawUser.team_id,
      user: {
        id: rawUser.id,
        name: rawUser.name,
        realName: rawUser.profile.name,
        displayName: rawUser.profile.display_name,
        image24: rawUser.profile.image_24,
        image32: rawUser.profile.image_32,
        image48: rawUser.profile.image_48,
        image72: rawUser.profile.image_72,
        isBot: rawUser.is_bot,
      },
    },
  })
}
