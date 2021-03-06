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
  try {
    const channel: Channel = {
      id: rawChannel.id,
      name: rawChannel.name,
      isChannel: rawChannel.is_channel,
      isGroup: rawChannel.is_group,
      isIM: rawChannel.is_im,
      isMember: rawChannel.is_member || rawChannel.isIM,
      isPrivate: rawChannel.is_private,
      lastRead: new Date(rawChannel.last_read * 1000),
    }

    if (channel.isChannel || (channel.isGroup && !channel.isIM)) {
      try {
        const info = await teamConnection.webClient.conversations.info({
          channel: rawChannel.id,
        })
        channel.topic = info.channel.topic.value
        channel.unreadCount = info.channel.unread_count
      } catch {
        console.log('info failed for', channel.id, channel.name)
      }
    }

    store.dispatch({
      type: ADD_CHANNEL,
      payload: {
        teamID: teamConnection.id,
        channel,
      },
    })
  } catch {}
}

export function addMessage(
  teamID: string,
  channelID: string,
  rawMessage: any,
  isNew: boolean,
) {
  const message = {
    id: channelID + rawMessage.ts,
    text: rawMessage.text,
    userID: rawMessage.user,
    subtype: rawMessage.subtype,
    ts: rawMessage.ts,
    timestamp: new Date(rawMessage.ts * 1000),
    threadTS: rawMessage.thread_ts,
  }
  store.dispatch({
    type: ADD_MESSAGE,
    payload: {
      teamID,
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
