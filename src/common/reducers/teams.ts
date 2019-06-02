import {
  ADD_TEAM,
  AddChannelAction,
  AddTeamAction,
  SelectChannelAction,
  SELECT_CHANNEL,
  Team,
  SELECT_TEAM,
  SelectTeamAction,
} from '../types'

export interface SelectedChannelTeam extends Team {
  selectedChannel?: string
}

interface TeamState {
  selectedTeam?: string
  teams: { [key: string]: SelectedChannelTeam }
}

export default (
  state: TeamState = { teams: {} },
  action:
    | AddTeamAction
    | AddChannelAction
    | SelectChannelAction
    | SelectTeamAction,
) => {
  switch (action.type) {
    case SELECT_TEAM:
      return {
        ...state,
        selectedTeam: action.payload,
      }
    case ADD_TEAM:
      return {
        ...state,
        selectedTeam: state.selectedTeam || action.payload.id,
        teams: {
          ...state.teams,
          [action.payload.id]: {
            ...action.payload,
          },
        },
      }
    case SELECT_CHANNEL:
      return {
        ...state,
        teams: {
          ...state.teams,
          [state.selectedTeam]: {
            ...state.teams[state.selectedTeam],
            selectedChannel: action.payload,
          },
        },
      }
    default:
      return state
  }
}
