import { ipcMain } from 'electron'
import store from './store'
import Server from './slack'
import { addMessage } from './slack-manager'

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
      addMessage(channelID, rawMessage)
    })
  }
}

const commands = new SlackCommands()

ipcMain.on('slack.fetchMessages', (event: any, channelID: string) => {
  commands.fetchMessages(channelID)
})

export default commands
