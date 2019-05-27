import { fetchMessages } from '@renderer/slack-commands'

import { SELECT_CHANNEL, SelectChannelAction } from '@common/types'

export function selectChannel(id: string): SelectChannelAction {
  fetchMessages(id)

  return {
    type: SELECT_CHANNEL,
    payload: id,
  }
}
