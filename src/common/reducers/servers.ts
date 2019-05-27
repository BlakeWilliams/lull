import {
  ADD_CHANNEL,
  ADD_SERVER,
  AddChannelAction,
  AddServerAction,
  Channel,
  SELECT_CHANNEL,
  SelectChannelAction,
} from '../../common/types'

interface ServerState {
  connected: boolean
  selectedChannel?: string
  id?: string
  name?: string
  domain?: string
  selfID?: string
  selfName?: string
  channels: { [key: string]: Channel }
}

export default (
  state: ServerState = { connected: false, channels: {} },
  action: AddServerAction | AddChannelAction | SelectChannelAction,
) => {
  switch (action.type) {
    case ADD_SERVER:
      return {
        ...state,
        ...action.payload,
      }
    case ADD_CHANNEL:
      return {
        ...state,
        channels: { ...state.channels, [action.payload.id]: action.payload },
      }
    case SELECT_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      }
    default:
      return state
  }
}
