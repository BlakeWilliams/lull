import { ipcRenderer } from 'electron'

export function fetchMessages(channelID: string) {
  ipcRenderer.send('slack.fetchMessages', channelID)
}
