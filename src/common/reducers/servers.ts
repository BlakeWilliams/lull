import {
  ADD_CHANNEL,
  ADD_SERVER,
  AddChannelAction,
  AddServerAction,
  Channel,
  SELECT_CHANNEL,
  SelectChannelAction,
  Server,
} from '../../common/types'

export interface SelectedChannelServer extends Server {
  selectedChannel?: string
}

interface ServerState {
  selectedServer?: string
  servers: { [key: string]: SelectedChannelServer }
}

export default (
  state: ServerState = { servers: {} },
  action: AddServerAction | AddChannelAction | SelectChannelAction,
) => {
  switch (action.type) {
    case ADD_SERVER:
      return {
        ...state,
        selectedServer: state.selectedServer || action.payload.id,
        servers: {
          ...state.servers,
          [action.payload.id]: {
            selectedChannel: undefined,
            ...action.payload,
          },
        },
      }
    case ADD_CHANNEL:
      return {
        ...state,
        servers: {
          ...state.servers,
          [action.payload.serverID]: {
            ...state.servers[action.payload.serverID],
            channels: {
              ...state.servers[action.payload.serverID].channels,
              [action.payload.channel.id]: action.payload.channel,
            },
          },
        },
      }
    case SELECT_CHANNEL:
      return {
        ...state,
        servers: {
          ...state.servers,
          [state.selectedServer]: {
            ...state.servers[state.selectedServer],
            selectedChannel: action.payload,
          },
        },
      }
    default:
      return state
  }
}
