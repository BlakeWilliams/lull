import {
  fetchMessages,
  sendMessage as sendRtmMessage,
} from '@renderer/slack-commands'

import {
  SEND_MESSAGE,
  SELECT_CHANNEL,
  SelectChannelAction,
} from '@common/types'

export function selectChannel(id: string): SelectChannelAction {
  fetchMessages(id)

  return {
    type: SELECT_CHANNEL,
    payload: id,
  }
}

export function sendMessage(text: string) {
  sendRtmMessage(text)
  return { type: SEND_MESSAGE, payload: text }
}
