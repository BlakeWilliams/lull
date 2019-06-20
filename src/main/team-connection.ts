import { RTMClient } from '@slack/rtm-api'
import { addChannel, addMessage, addTeam, addUser } from './slack-manager'
import Logger from '@main/logger'

class TeamConnection {
  id: string
  name?: string
  userID: string
  token: string
  rtm: RTMClient

  constructor(token: string) {
    this.rtm = new RTMClient(token)
  }

  public async connect(): Promise<void> {
    Logger.info('connecting to a server...')

    return this.rtm
      .start()
      .then(async (data: any) => {
        Logger.info(`connected to ${data.team.name}`)
        this.id = data.team.id
        this.name = data.team.name
        this.userID = data.self.id

        const teamInfo = await this.getTeamInfo()
        addTeam(data, teamInfo)

        this.getTeamInfo()
        this.addHandlers()
        this.fetchChannels()
        this.fetchUsers()
      })
      .catch(err => {
        console.log('Could not connect to server: ', err)
      })
  }

  public async sendMessage(channelID: string, text: string): Promise<string> {
    const sendResult = await this.rtm.sendMessage(text, channelID)

    // has to be formatted as if slack provided the message
    addMessage(
      this.id,
      channelID,
      {
        text: text,
        user: this.userID,
        ts: sendResult.ts,
      },
      true,
    )
    return sendResult.ts
  }

  public get webClient() {
    // @ts-ignore
    return this.rtm.webClient
  }

  private async getTeamInfo(): Promise<any> {
    const data = await this.webClient.team.info()
    return data.team
  }

  private async fetchChannels() {
    Logger.info(`fetching channels for ${this.name}`)
    let channelResponse = await this.webClient.conversations.list({
      types: 'public_channel,private_channel,im,mpim',
    })

    let isPaginating = true

    while (isPaginating) {
      channelResponse.channels.forEach(async (data: any) => {
        Logger.info(data, `adding channel`)
        addChannel(this, data)

        if (data.is_member) {
          try {
            if (data.is_mpim) {
              Logger.info(data, `mpim history`)
              const history = await this.webClient.conversations.history({
                channel: data.id,
              })

              history.messages.forEach((rawMessage: any) => {
                addMessage(this.id, data.id, rawMessage, false)
              })
            } else {
              Logger.info(data, `other history`)
              const history = await this.webClient.channels.history({
                channel: data.id,
              })

              history.messages.forEach((rawMessage: any) => {
                addMessage(this.id, data.id, rawMessage, false)
              })
            }
          } catch (e) {
            Logger.info(`error fetching history for: ${data.name}`)
          }
        }
      })

      if (channelResponse.response_metadata.next_cursor) {
        channelResponse = await this.webClient.channels.list({
          cursor: channelResponse.response_metadata.next_cursor,
        })
        isPaginating = true
      } else {
        isPaginating = false
      }
    }
  }

  private async fetchUsers() {
    Logger.info(`fetching users for ${this.name}`)
    let data: any = await this.webClient.users.list()
    let isPaginating = true

    while (isPaginating) {
      data.members.forEach(addUser)

      if (data.response_metadata.next_cursor) {
        this.webClient.users.list({
          cursor: data.response_metadata.next_cursor,
        })
        isPaginating = true
        Logger.info(`paginating users for ${this.name}`)
      } else {
        isPaginating = false
      }
    }
  }

  private addHandlers() {
    // TODO handle most of these events https://api.slack.com/rtm

    this.rtm.on('message', (data: any) => {
      console.log('MESSAGE EVENT', data)
      switch (data.subtype) {
        case 'message_changed':
          addMessage(this.id, data.channel, data.message, true)
        default:
          if (data.text) {
            addMessage(this.id, data.channel, data, true)
          }
      }
    })
    this.rtm.on('channel_joined', (data: any) => addChannel(this, data.channel))
    this.rtm.on('channel_rename', (data: any) => {
      addChannel(this, data.channel)
    })
  }
}

export default TeamConnection
