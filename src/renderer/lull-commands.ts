import { ipcRenderer } from 'electron'

export function openLogin() {
  ipcRenderer.send('lull.openLogin')
}
