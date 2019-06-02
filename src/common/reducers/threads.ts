import { createReducer } from 'redux-starter-kit'
import { ADD_MESSAGE, AddMessageAction, Message } from '@common/types'

type State = { [key: string]: { [key: string]: Message } }

export default createReducer<State>(
  {},
  {
    [ADD_MESSAGE]: (state: State, action: AddMessageAction) => {
      const { channelID, message } = action.payload
      const parentID = channelID + message.threadTS

      if (message.threadTS && message.threadTS != message.ts) {
        state[parentID] = state[parentID] || {}
        state[parentID][message.ts] = {
          ...(state[parentID][message.ts] || {}),
          ...message,
        }
      }
    },
  },
)
