import { RTMClient } from '@slack/rtm-api'
import { WebAPICallResult } from '@slack/web-api'
import {
  ADD_SERVER,
  ADD_CHANNEL,
  AddServerAction,
  AddChannelAction,
  Channel,
} from '../common/types'

class Server {
  id: string
  token: string
  store: any
  rtm: RTMClient

  constructor(token: string, store: any) {
    this.store = store
    this.rtm = new RTMClient(token)
  }

  connect(): Promise<void> {
    return this.rtm
      .start()
      .then((data: any) => {
        this.id = data.team.id

        const action: AddServerAction = {
          type: ADD_SERVER,
          payload: {
            id: data.team.id,
            name: data.team.name,
            domain: data.team.domain,
            selfID: data.self.id,
            selfName: data.self.name,
          },
        }

        this.store.dispatch(action)
        this.fetchChannels()
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
    channelResponse.channels.forEach((rawChannel: any) => {
      if (rawChannel.is_member) {
        const channel = {
          id: rawChannel.id,
          name: rawChannel.name,
          isChannel: rawChannel.is_channel,
        }
        this.store.dispatch({ type: ADD_CHANNEL, payload: channel })
      }

      console.log(this.store.getState())
    })
  }
}

export default Server
