import {
  ADD_CHANNEL,
  AddChannelAction,
  Channel,
  SELECT_CHANNEL,
  SelectChannelAction,
  ResetUnreads,
  RESET_UNREADS,
  ADD_MESSAGE,
  AddMessageAction,
} from '../types'

type ChannelMap = { [key: string]: Channel }
type TeamChannelMap = { [key: string]: ChannelMap }

export default (
  state: TeamChannelMap = {},
  action: AddChannelAction | ResetUnreads | AddMessageAction,
) => {
  let channel
  switch (action.type) {
    case ADD_CHANNEL:
      return {
        ...state,
        [action.payload.teamID]: {
          ...(state[action.payload.teamID] || {}),
          [action.payload.channel.id]: {
            ...(state[action.payload.channel.id] || {}),
            ...action.payload.channel,
          },
        },
      }
    case ADD_MESSAGE:
      channel = state[action.payload.teamID][action.payload.channelID]

      if (channel.lastRead < action.payload.message.timestamp) {
        return {
          ...state,
          [action.payload.teamID]: {
            ...(state[action.payload.teamID] || {}),
            [action.payload.channelID]: {
              ...(channel || {}),
              unreadCount: channel.unreadCount + 1,
            },
          },
        }
      } else {
        return state
      }
    case RESET_UNREADS:
      channel = state[action.payload.teamID][action.payload.channelID]

      return {
        ...state,
        [action.payload.teamID]: {
          ...(state[action.payload.teamID] || {}),
          [action.payload.channelID]: {
            ...(channel || {}),
            lastRead: new Date(),
            unreadCount: 0,
          },
        },
      }
    default:
      return state
  }
}
