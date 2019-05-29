import { ADD_MESSAGE, AddMessageAction, Message } from '@common/types'

type State = { [key: string]: { [key: string]: Message[] } }

export default (state: State = {}, action: AddMessageAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      const existingMessages = state[action.payload.channelID] || {}

      console.log('ADDDING', action)
      return {
        ...state,
        [action.payload.channelID]: {
          ...existingMessages,
          [action.payload.message.ts]: {
            ...(existingMessages[action.payload.message.ts] || {}),
            ...action.payload.message,
          },
        },
      }

      return {
        ...state,
        [action.payload.channelID]: {
          ...existingMessages,
          [action.payload.message.ts]: {
            ...action.payload.message,
          },
        },
      }
    default:
      return state
  }
}
