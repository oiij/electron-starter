import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { createElectronHandler } from 'electron/utils/create-electron-handler'

// 获取所有窗口
const [getAllWindowsHandle, getAllWindowsInvoke] = createElectronHandler('window:get-all-windows', () => {
  return BrowserWindow.getAllWindows()
})
// 获取当前窗口
const [getCurrentWindowHandle, getCurrentWindowInvoke] = createElectronHandler('window:get-current-window', (_) => {
  return BrowserWindow.fromId(_.frameId)
})
// 最小化当前窗口
const [minimizeCurrentWindowHandle, minimizeCurrentWindowInvoke] = createElectronHandler('window:minimize', (_) => {
  return BrowserWindow.fromId(_.frameId)?.minimize()
})
// 最大化当前窗口
const [maximizeCurrentWindowHandle, maximizeCurrentWindowInvoke] = createElectronHandler('window:maximize', (_) => {
  return BrowserWindow.fromId(_.frameId)?.maximize()
})
// 取消最大化当前窗口
const [unmaximizeCurrentWindowHandle, unmaximizeCurrentWindowInvoke] = createElectronHandler('window:unmaximize', (_) => {
  return BrowserWindow.fromId(_.frameId)?.unmaximize()
})
// 是否最大化
const [isMaximizedCurrentWindowHandle, isMaximizedCurrentWindowInvoke] = createElectronHandler('window:is-maximized', (_) => {
  return BrowserWindow.fromId(_.frameId)?.isMaximized()
})
// 切换最大化当前窗口
const [toggleMaximizeCurrentWindowHandle, toggleMaximizeCurrentWindowInvoke] = createElectronHandler('window:toggle-maximize', (_) => {
  return BrowserWindow.fromId(_.frameId)?.isMaximized()
    ? BrowserWindow.fromId(_.frameId)?.unmaximize()
    : BrowserWindow.fromId(_.frameId)?.maximize()
})
// 关闭当前窗口
const [closeCurrentWindowHandle, closeCurrentWindowInvoke] = createElectronHandler('window:close', (_) => {
  return BrowserWindow.fromId(_.frameId)?.close()
})
// 隐藏当前窗口
const [hideCurrentWindowHandle, hideCurrentWindowInvoke] = createElectronHandler('window:hide', (_) => {
  return BrowserWindow.fromId(_.frameId)?.hide()
})
// 显示当前窗口
const [showCurrentWindowHandle, showCurrentWindowInvoke] = createElectronHandler('window:show', (_) => {
  return BrowserWindow.fromId(_.frameId)?.show()
})
// 设置全屏
const [setFullScreenCurrentWindowHandle, setFullScreenCurrentWindowInvoke] = createElectronHandler('window:set-full-screen', (_) => {
  return BrowserWindow.fromId(_.frameId)?.setFullScreen(true)
})
// 取消全屏
const [unsetFullScreenCurrentWindowHandle, unsetFullScreenCurrentWindowInvoke] = createElectronHandler('window:unset-full-screen', (_) => {
  return BrowserWindow.fromId(_.frameId)?.setFullScreen(false)
})
// 是否全屏
const [isFullScreenCurrentWindowHandle, isFullScreenCurrentWindowInvoke] = createElectronHandler('window:is-full-screen', (_) => {
  return BrowserWindow.fromId(_.frameId)?.isFullScreen()
})
// 切换全屏
const [toggleFullScreenCurrentWindowHandle, toggleFullScreenCurrentWindowInvoke] = createElectronHandler('window:toggle-full-screen', (_) => {
  return BrowserWindow.fromId(_.frameId)?.isFullScreen()
    ? BrowserWindow.fromId(_.frameId)?.setFullScreen(false)
    : BrowserWindow.fromId(_.frameId)?.setFullScreen(true)
})
// 打开开发者工具
const [openDevToolsCurrentWindowHandle, openDevToolsCurrentWindowInvoke] = createElectronHandler('window:open-devtools', (_) => {
  return BrowserWindow.fromId(_.frameId)?.webContents.openDevTools()
})
// 关闭开发者工具
const [closeDevToolsCurrentWindowHandle, closeDevToolsCurrentWindowInvoke] = createElectronHandler('window:close-devtools', (_) => {
  return BrowserWindow.fromId(_.frameId)?.webContents.closeDevTools()
})

export function registerWindowHandle() {
  getAllWindowsHandle()
  getCurrentWindowHandle()
  minimizeCurrentWindowHandle()
  maximizeCurrentWindowHandle()
  unmaximizeCurrentWindowHandle()
  isMaximizedCurrentWindowHandle()
  toggleMaximizeCurrentWindowHandle()
  closeCurrentWindowHandle()
  hideCurrentWindowHandle()
  showCurrentWindowHandle()
  setFullScreenCurrentWindowHandle()
  unsetFullScreenCurrentWindowHandle()
  isFullScreenCurrentWindowHandle()
  toggleFullScreenCurrentWindowHandle()
  openDevToolsCurrentWindowHandle()
  closeDevToolsCurrentWindowHandle()

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
export const windowExpose = {
  getAllWindowsInvoke,
  getCurrentWindowInvoke,
  minimizeCurrentWindowInvoke,
  maximizeCurrentWindowInvoke,
  unmaximizeCurrentWindowInvoke,
  isMaximizedCurrentWindowInvoke,
  toggleMaximizeCurrentWindowInvoke,
  closeCurrentWindowInvoke,
  hideCurrentWindowInvoke,
  showCurrentWindowInvoke,
  setFullScreenCurrentWindowInvoke,
  unsetFullScreenCurrentWindowInvoke,
  isFullScreenCurrentWindowInvoke,
  toggleFullScreenCurrentWindowInvoke,
  openDevToolsCurrentWindowInvoke,
  closeDevToolsCurrentWindowInvoke,

  // 注册窗口最大化事件
  onMaximize(callback: () => void) {
    ipcRenderer.send('register:maximize')
    ipcRenderer.on('window:maximize', callback)
    ipcRenderer.on('window:unmaximize', callback)
  },
  // 移除窗口最大化事件
  offMaximize() {
    ipcRenderer.send('unregister:maximize')
    ipcRenderer.removeAllListeners('window:maximize')
    ipcRenderer.removeAllListeners('window:unmaximize')
  },

}
