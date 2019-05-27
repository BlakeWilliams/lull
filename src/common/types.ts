export const ADD_SERVER = 'ADD_SERVER'
export const ADD_CHANNEL = 'ADD_CHANNEL'
export const SELECT_CHANNEL = 'SELECT_CHANNEL'

export interface SelectChannelAction {
  type: typeof SELECT_CHANNEL
  payload: string
}

export interface AddServerAction {
  type: typeof ADD_SERVER
  payload: {
    id: string
    name: string
    domain: string
    selfID: string
    selfName: string
  }
}

export interface AddChannelAction {
  type: typeof ADD_CHANNEL
  payload: Channel
}

// Slack types
export interface Server {
  id: string
  name: string
  domain: string
  self: {
    id: string
    name: string
  }
  channels: Channel[]
}

export interface Channel {
  id: string
  name: string
  isChannel: boolean
}

export const ADD_MESSAGE = 'ADD_MESSAGE'

export interface Message {
  id: string
  text: string
  userID: string
  timestamp: Date
}

export interface AddMessageAction {
  type: typeof ADD_MESSAGE
  payload: {
    channelID: string
    message: Message
  }
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
    serverID: string
    user: User
  }
}
