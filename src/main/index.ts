import url from 'url'
import path from 'path'
import { app, BrowserWindow } from 'electron'
import isElectronDev from 'electron-is-dev'
import store from './store'
import Server from './slack'
import SlackCommands from './slack-commands'

// dumb hack to make store used
const _store = store

const server = new Server(process.env.SLACK_TOKEN, store)
server.connect().then(() => {
  SlackCommands.addServer(server)
})

let mainWindow: undefined | BrowserWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(getHtmlPath('chat.html'))
  mainWindow.webContents.openDevTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

export default function getHtmlPath(name: string): string {
  if (isElectronDev) {
    return `http://localhost:8008/${name}`
  } else {
    return url.format({
      pathname: path.join(__dirname, `../renderer/${name}`),
      protocol: 'file:',
      slashes: true,
    })
  }
}
