import { ipcRenderer } from 'electron'

export function fetchMessages(channelID: string) {
  ipcRenderer.send('slack.fetchMessages', channelID)
}

export function sendMessage(text: string) {
  ipcRenderer.send('slack.sendMessage', text)
}
