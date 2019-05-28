import { ipcMain } from 'electron'
import store from './store'
import TeamConnection from './team-connection'
import { addMessage } from './slack-manager'

type Teams = { [key: string]: TeamConnection }

class SlackCommands {
  teams: Teams

  constructor() {
    this.teams = {}
  }

  addTeam(team: TeamConnection) {
    this.teams[team.id] = team
  }

  async fetchMessages(channelID: string) {
    const history = await this.currentTeam.webClient.channels.history({
      channel: channelID,
    })

    history.messages.forEach((rawMessage: any) => {
      addMessage(channelID, rawMessage)
    })
  }

  async sendMessage(text: string) {
    this.currentTeam.sendMessage(this.currentChannelID, text)
  }

  private get currentChannelID(): string {
    const state = store.getState()
    const teamID = state.teams.selectedTeam!
    return state.teams.teams[teamID].selectedChannel!
  }

  private get currentTeam() {
    const state = store.getState()
    const teamID = state.teams.selectedTeam!
    return this.teams[teamID]
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
