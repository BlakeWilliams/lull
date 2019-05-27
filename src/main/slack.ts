import { RTMClient } from '@slack/rtm-api'

import { addChannel, addMessage, addServer, addUser } from './slack-manager'

class Server {
  id: string
  token: string
  rtm: RTMClient

  constructor(token: string) {
    this.rtm = new RTMClient(token)
  }

  connect(): Promise<void> {
    return this.rtm
      .start()
      .then((data: any) => {
        this.id = data.team.id
        addServer(data)

        this.addHandlers()
        this.fetchChannels()
        this.fetchUsers()
      })
      .catch(err => {
        console.log('Could not connect to server: ', err)
      })
  }

  public get webClient() {
    // @ts-ignore
    return this.rtm.webClient
  }

  private async fetchChannels() {
    const channelResponse = await this.webClient.channels.list()
    channelResponse.channels.forEach(addChannel)
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

    this.rtm.on('message', addMessage)
    this.rtm.on('channel_joined', (data: any) => addChannel(data.channel))
    this.rtm.on('channel_rename', (data: any) => addChannel(data.channel))
  }
}

export default Server
