// import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { registerElectronFetch } from 'electron-plugin-fetch/plugin'
import { registerWindowHandle } from '../plugin/window'

// const _require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWin: BrowserWindow | null = null
let loadingWin: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
const loadingHtml = path.join(RENDERER_DIST, 'loading.html')

function createMainWindow() {
  const window = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC ?? '', 'favicon.ico'),
    show: false,
    center: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    window.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    window.webContents.openDevTools()
  }
  else {
    window.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  window.webContents.on('did-finish-load', () => {
    window?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
  return window
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}
function createLoadingWindow() {
  const window = new BrowserWindow({
    title: 'Loading',
    icon: path.join(process.env.VITE_PUBLIC ?? '', 'favicon.ico'),
    width: 200,
    height: 200,
    transparent: true,
    titleBarStyle: 'hidden',
  })
  if (VITE_DEV_SERVER_URL) { // #298
    window.loadURL(`${VITE_DEV_SERVER_URL}/loading.html`)
  }
  else {
    window.loadFile(loadingHtml)
  }
  return window
}
app.whenReady().then(() => {
  mainWin = createMainWindow()
  loadingWin = createLoadingWindow()
})

app.on('window-all-closed', () => {
  mainWin = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (mainWin) {
    // Focus on the main window if the user tried to open another
    if (mainWin.isMinimized())
      mainWin.restore()
    mainWin.focus()
  }
})

app.on('activate', () => {
  loadingWin?.focus()
  // const allWindows = BrowserWindow.getAllWindows()
  // if (allWindows.length) {
  //   allWindows[0].focus()
  // }
  // else {
  //   createMainWindow()
  // }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  }
  else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
ipcMain.once('loaded', () => {
  loadingWin?.close()
  loadingWin = null
  mainWin?.show()
})
registerElectronFetch()

registerWindowHandle()
