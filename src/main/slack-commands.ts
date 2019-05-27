import { ipcMain } from 'electron'
import { ADD_MESSAGE, AddMessageAction, Message } from '@common/types'
import store from './store'
import Server from './slack'

type Servers = { [key: string]: Server }

class SlackCommands {
  servers: Servers

  constructor() {
    this.servers = {}
  }

  addServer(server: Server) {
    this.servers[server.id] = server
  }

  async fetchMessages(channelID: string) {
    const serverID = store.getState().servers.id
    const server = this.servers[serverID]
    const history = await server.webClient.channels.history({
      channel: channelID,
    })

    history.messages.forEach((rawMessage: any) => {
      const message = {
        id: rawMessage.client_msg_id,
        text: rawMessage.text,
        userID: rawMessage.user,
        timestamp: Date.parse(rawMessage.ts),
      }
      store.dispatch({
        type: ADD_MESSAGE,
        payload: {
          channelID,
          message,
        },
      })
    })
  }
}

const commands = new SlackCommands()

ipcMain.on('slack.fetchMessages', (event: any, channelID: string) => {
  commands.fetchMessages(channelID)
})

export default commands
