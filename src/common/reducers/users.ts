import { ADD_USER, AddUserAction, User } from '@common/types'

type UserMap = { [key: string]: User }
type State = { [key: string]: UserMap }

export default (state: State = {}, action: AddUserAction) => {
  switch (action.type) {
    case ADD_USER:
      const existingServerUsers = state[action.payload.serverID] || {}
      return {
        ...state,
        [action.payload.serverID]: {
          ...existingServerUsers,
          [action.payload.user.id]: action.payload.user,
        },
      }
    default:
      return state
  }
}
