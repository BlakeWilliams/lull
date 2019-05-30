import { last } from 'lodash'
import { ipcMain } from 'electron'
import store from './store'
import TeamConnection from './team-connection'
import { addMessage } from './slack-manager'
import { RESET_UNREADS } from '@common/types'

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
      addMessage(this.currentTeam.id, channelID, rawMessage)
    })
  }

  async sendMessage(text: string) {
    this.currentTeam.sendMessage(this.currentChannelID, text)
  }

  async sendReadMarker(channelID: string) {
    const timestamps = store.getState().messages[channelID]
    const latestTS = last(Object.keys(timestamps).sort())

    this.currentTeam.webClient.channels.mark({
      channel: channelID,
      ts: latestTS,
    })

    store.dispatch({
      type: RESET_UNREADS,
      payload: {
        teamID: this.currentTeam.id,
        channelID,
      },
    })
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

ipcMain.on('slack.sendReadMarker', (event: any, channelID: string) => {
  commands.sendReadMarker(channelID)
})

export default commands
