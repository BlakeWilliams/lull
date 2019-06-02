export const ADD_TEAM = 'ADD_TEAM'
export const ADD_CHANNEL = 'ADD_CHANNEL'
export const SELECT_CHANNEL = 'SELECT_CHANNEL'
export const RESET_UNREADS = 'RESET_UNREADS'

export interface ResetUnreads {
  type: typeof RESET_UNREADS
  payload: {
    channelID: string
    teamID: string
  }
}

export interface SelectChannelAction {
  type: typeof SELECT_CHANNEL
  payload: string
}

export interface AddTeamAction {
  type: typeof ADD_TEAM
  payload: Team
}

export interface AddChannelAction {
  type: typeof ADD_CHANNEL
  payload: {
    teamID: string
    channel: Channel
  }
}

// Slack types
export interface Team {
  id: string
  name: string
  domain: string
  image132: string
  self: {
    id: string
    name: string
  }
  channels: { [key: string]: Channel[] }
}

export interface Channel {
  id: string
  name: string
  isChannel: boolean
  topic: string
  lastRead?: Date
  isMember: boolean
  isPrivate: boolean
  unreadCount: number
}

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const SEND_MESSAGE = 'SEND_MESSAGE'

export interface Message {
  id: string
  text: string
  userID: string
  ts: string
  timestamp: Date
  subtype?: string
  threadTS?: string
  threadCount: number
}

export interface AddMessageAction {
  type: typeof ADD_MESSAGE
  payload: {
    teamID: string
    channelID: string
    message: Message
  }
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE
  payload: string
}

export const ADD_USER = 'ADD_USER'

export interface User {
  id: string
  name: string
  realName: string
  displayName: string
  image24: string
  image32: string
  image48: string
  image72: string
  isBot: boolean
}

export interface AddUserAction {
  type: typeof ADD_USER
  payload: {
    teamID: string
    user: User
  }
}
