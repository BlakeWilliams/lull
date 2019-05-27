import { ADD_MESSAGE, AddMessageAction, Message } from '../../common/types'

type MessageState = Message[]
type Messages = { [key: string]: MessageState }

export default (state: Messages = {}, action: AddMessageAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      const existingMessages = state[action.payload.channelID] || []
      const existingMessageIDs = existingMessages.map(message => message.id)

      if (existingMessageIDs.includes(action.payload.message.id)) {
        return state
      } else {
        return {
          ...state,
          [action.payload.channelID]: [
            ...existingMessages,
            action.payload.message,
          ],
        }
      }
    default:
      return state
  }
}
