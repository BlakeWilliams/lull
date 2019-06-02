import { sendMessage as sendRtmMessage } from '@renderer/slack-commands'

import {
  SEND_MESSAGE,
  SELECT_CHANNEL,
  SelectChannelAction,
  SELECT_TEAM,
  SelectTeamAction,
} from '@common/types'

export function selectTeam(id: string): SelectTeamAction {
  console.log('selecting team', id)
  return {
    type: SELECT_TEAM,
    payload: id,
  }
}

export function selectChannel(id: string): SelectChannelAction {
  return {
    type: SELECT_CHANNEL,
    payload: id,
  }
}

export function sendMessage(text: string) {
  sendRtmMessage(text)
  return { type: SEND_MESSAGE, payload: text }
}
