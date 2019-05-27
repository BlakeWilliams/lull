import { ipcMain } from 'electron'
import store from './store'
import Server from './server'
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
    const history = await this.currentServer.webClient.channels.history({
      channel: channelID,
    })

    history.messages.forEach((rawMessage: any) => {
      addMessage(channelID, rawMessage)
    })
  }

  async sendMessage(text: string) {
    this.currentServer.sendMessage(this.currentChannelID, text)
  }

  private get currentChannelID(): string {
    const state = store.getState()
    const serverID = state.servers.selectedServer!
    return state.servers.servers[serverID].selectedChannel!
  }

  private get currentServer() {
    const state = store.getState()
    const serverID = state.servers.selectedServer!
    return this.servers[serverID]
  }
}

const commands = new SlackCommands()

ipcMain.on('slack.fetchMessages', (event: any, channelID: string) => {
  commands.fetchMessages(channelID)
})

ipcMain.on('slack.sendMessage', (event: any, text: string) => {
  commands.sendMessage(text)
})

export default commands
