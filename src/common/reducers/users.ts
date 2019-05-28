import { ADD_USER, AddUserAction, User } from '@common/types'

type UserMap = { [key: string]: User }
type State = { [key: string]: UserMap }

export default (state: State = {}, action: AddUserAction) => {
  switch (action.type) {
    case ADD_USER:
      const existingTeamUsers = state[action.payload.teamID] || {}
      return {
        ...state,
        [action.payload.teamID]: {
          ...existingTeamUsers,
          [action.payload.user.id]: action.payload.user,
        },
      }
    default:
      return state
  }
}
