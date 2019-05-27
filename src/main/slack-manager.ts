import store from './store'

import {
  ADD_SERVER,
  ADD_CHANNEL,
  AddServerAction,
  ADD_MESSAGE,
  ADD_USER,
} from '@common/types'

export function addServer(rtmData: any) {
  const action: AddServerAction = {
    type: ADD_SERVER,
    payload: {
      id: rtmData.team.id,
      name: rtmData.team.name,
      domain: rtmData.team.domain,
      selfID: rtmData.self.id,
      selfName: rtmData.self.name,
    },
  }

  store.dispatch(action)
}

export function addChannel(rawChannel: any) {
  if (rawChannel.is_member) {
    const channel = {
      id: rawChannel.id,
      name: rawChannel.name,
      isChannel: rawChannel.is_channel || true,
    }
    store.dispatch({ type: ADD_CHANNEL, payload: channel })
  }
}

export function addMessage(channelID: string, rawMessage: any) {
  const message = {
    id: rawMessage.client_msg_id,
    text: rawMessage.text,
    userID: rawMessage.user,
    timestamp: Date.parse(rawMessage.ts),
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
      serverID: rawUser.team_id,
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
