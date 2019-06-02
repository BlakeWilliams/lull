import url from 'url'
import path from 'path'
import { ipcMain, app, BrowserWindow, shell } from 'electron'
import isElectronDev from 'electron-is-dev'
import ElectronStore from 'electron-store'

import TeamConnection from './team-connection'
import SlackCommands from './slack-commands'

interface ServerInfo {
  token: string
}

interface StoredData {
  servers: Array<ServerInfo>
}

const dataStore = new ElectronStore()
const servers: Array<ServerInfo> =
  (dataStore.get('servers') as Array<ServerInfo>) || []

const teams = []

servers.forEach(server => {
  openTeam(server.token)
})

let mainWindow: undefined | BrowserWindow
let loginWindow: undefined | BrowserWindow

app.on('ready', () => {
  if (teams.length === 0) {
    openLogin()
  } else {
    openMainWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function openLogin() {
  loginWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  })

  loginWindow.loadURL('https://slack.com/signin')
  loginWindow.webContents.on('did-navigate', () => {
    loginWindow.webContents
      .executeJavaScript('Promise.resolve(boot_data["api_token"])')
      .then(token => {
        if (token) {
          servers.push({ token })
          dataStore.set('servers', servers)
          openMainWindow()
          loginWindow.destroy()
        }
      })
  })
}

function openTeam(token: string) {
  const team = new TeamConnection(token)
  team.connect().then(() => {
    SlackCommands.addTeam(team)
  })

  teams.push(team)
}

function openMainWindow() {
  // don't open up more than 1 window
  if (mainWindow) {
    return
  }

  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(getHtmlPath('chat.html'))
  const handleRedirect = (e: any, url: string) => {
    if (url != mainWindow.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }

  mainWindow.webContents.on('will-navigate', handleRedirect)
  mainWindow.webContents.on('new-window', handleRedirect)

  mainWindow.webContents.openDevTools()
}

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

ipcMain.on('lull.openLogin', () => {
  openLogin()
})
