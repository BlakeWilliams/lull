import {
  ADD_CHANNEL,
  ADD_TEAM,
  AddChannelAction,
  AddTeamAction,
  Channel,
  SELECT_CHANNEL,
  SelectChannelAction,
  Team,
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
  action: AddTeamAction | AddChannelAction | SelectChannelAction,
) => {
  switch (action.type) {
    case ADD_TEAM:
      return {
        ...state,
        selectedTeam: state.selectedTeam || action.payload.id,
        teams: {
          ...state.teams,
          [action.payload.id]: {
            selectedChannel: undefined,
            ...action.payload,
          },
        },
      }
    case ADD_CHANNEL:
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.payload.teamID]: {
            ...state.teams[action.payload.teamID],
            channels: {
              ...state.teams[action.payload.teamID].channels,
              [action.payload.channel.id]: action.payload.channel,
            },
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
