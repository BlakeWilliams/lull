import url from 'url'
import path from 'path'
import { app, BrowserWindow, shell } from 'electron'
import isElectronDev from 'electron-is-dev'
import TeamConnection from './team-connection'
import SlackCommands from './slack-commands'

const team = new TeamConnection(process.env.SLACK_TOKEN)
team.connect().then(() => {
  SlackCommands.addTeam(team)
})

let mainWindow: undefined | BrowserWindow

app.on('ready', () => {
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
