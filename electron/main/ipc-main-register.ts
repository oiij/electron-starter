import type { IpcMain } from 'electron'
import { BrowserWindow } from 'electron'
import { windowInvokeMap as _WIM } from '../utils/invoke-maps'

export function registerIpcMain(ipcMain: IpcMain) {
  // windows
  ipcMain.handle(_WIM.GetAllWindows, () => BrowserWindow.getAllWindows())
  ipcMain.handle(_WIM.GetCurrentWindow, event => BrowserWindow.fromId(event.frameId))
  ipcMain.handle(_WIM.MinimizeCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.minimize())
  ipcMain.handle(_WIM.MaximizeCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.maximize())
  ipcMain.handle(_WIM.UnMaximizeCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.unmaximize())
  ipcMain.handle(_WIM.IsMaximizedCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.isMaximized())
  ipcMain.handle(_WIM.ToggleMaximizeCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.isMaximized() ? BrowserWindow.fromId(event.frameId)?.unmaximize() : BrowserWindow.fromId(event.frameId)?.maximize())
  ipcMain.handle(_WIM.CloseCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.close())
  ipcMain.handle(_WIM.HideCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.hide())
  ipcMain.handle(_WIM.ShowCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.show())
  ipcMain.handle(_WIM.SetFullScreenCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.setFullScreen(!BrowserWindow.fromId(event.frameId)?.isFullScreen()))
  ipcMain.handle(_WIM.UnSetFullScreenCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.setFullScreen(false))
  ipcMain.handle(_WIM.IsFullScreenCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.isFullScreen())
  ipcMain.handle(_WIM.ToggleFullScreenCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.isFullScreen() ? BrowserWindow.fromId(event.frameId)?.setFullScreen(false) : BrowserWindow.fromId(event.frameId)?.setFullScreen(true))
  ipcMain.handle(_WIM.OpenDevToolsCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.webContents.openDevTools())
  ipcMain.handle(_WIM.CloseDevToolsCurrentWindow, event => BrowserWindow.fromId(event.frameId)?.webContents.closeDevTools())
  // 注册窗口最大化事件
  ipcMain.once('register:maximize', (_) => {
    BrowserWindow.fromId(_.frameId)?.on('maximize', () => {
      _.reply('window:maximize')
    })
    BrowserWindow.fromId(_.frameId)?.on('unmaximize', () => {
      _.reply('window:unmaximize')
    })
  })
  // 移除窗口最大化事件
  ipcMain.once('unregister:maximize', (_) => {
    BrowserWindow.fromId(_.frameId)?.removeAllListeners('maximize')
    BrowserWindow.fromId(_.frameId)?.removeAllListeners('unmaximize')
  })
  // 注册窗口最小化事件
  ipcMain.once('register:minimize', (_) => {
    BrowserWindow.fromId(_.frameId)?.once('minimize', () => {
      _.reply('window:minimize')
    })
    BrowserWindow.fromId(_.frameId)?.once('restore', () => {
      _.reply('window:restore')
    })
  })
}
