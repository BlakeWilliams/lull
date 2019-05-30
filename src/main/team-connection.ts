import { RTMClient } from '@slack/rtm-api'
import { addChannel, addMessage, addTeam, addUser } from './slack-manager'

class TeamConnection {
  id: string
  userID: string
  token: string
  rtm: RTMClient

  constructor(token: string) {
    this.rtm = new RTMClient(token)
  }

  public async connect(): Promise<void> {
    return this.rtm
      .start()
      .then(async (data: any) => {
        this.id = data.team.id
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
    addMessage(this.id, channelID, {
      text: text,
      user: this.userID,
      ts: sendResult.ts,
    })
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
    let channelResponse = await this.webClient.channels.list()

    let isPaginating = true

    while (isPaginating) {
      channelResponse.channels.forEach(async (data: any) => {
        addChannel(this, data)

        if (data.is_member) {
          const history = await this.webClient.channels.history({
            channel: data.id,
          })

          history.messages.forEach((rawMessage: any) => {
            addMessage(this.id, data.id, rawMessage)
          })
        }

        if (channelResponse.response_metadata.next_cursor) {
          channelResponse = await this.webClient.channels.list({
            cursor: channelResponse.response_metadata.next_cursor,
          })
          isPaginating = true
        } else {
          isPaginating = false
        }
      })
    }
  }

  private async fetchUsers() {
    let data: any = await this.webClient.users.list()
    let isPaginating = true

    while (isPaginating) {
      data.members.forEach(addUser)

      if (data.response_metadata.next_cursor) {
        this.webClient.users.list({
          cursor: data.response_metadata.next_cursor,
        })
        isPaginating = true
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
          addMessage(this.id, data.channel, data.message)
        default:
          if (data.text) {
            addMessage(this.id, data.channel, data)
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
