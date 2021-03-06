import { createReducer } from 'redux-starter-kit'
import { ADD_MESSAGE, AddMessageAction, Message } from '@common/types'

type State = { [key: string]: { [key: string]: Message } }

export default createReducer<State>(
  {},
  {
    [ADD_MESSAGE]: (state: State, action: AddMessageAction) => {
      const { channelID, message } = action.payload

      if (message.threadTS && message.threadTS != message.ts) {
        if (state[channelID] && state[channelID][message.threadTS]) {
          const existingCount =
            state[channelID][message.threadTS].threadCount || 0
          state[channelID][message.threadTS].threadCount = existingCount + 1
        }
      } else {
        state[channelID] = state[channelID] || {}
        state[channelID][message.ts] = {
          ...(state[channelID][message.ts] || {}),
          ...message,
        }
      }
    },
  },
)
