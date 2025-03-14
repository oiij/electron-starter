import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'

export function registerWindowHandle() {
  // 获取所有窗口
  ipcMain.handle('window:get-all-windows', (_) => {
    return BrowserWindow.getAllWindows()
  })
  // 获取当前窗口
  ipcMain.handle('window:get-current-window', (_) => {
    return BrowserWindow.fromId(_.frameId)
  })
  // 最小化当前窗口
  ipcMain.handle('window:minimize', (_) => {
    return BrowserWindow.fromId(_.frameId)?.minimize()
  })
  // 最大化当前窗口
  ipcMain.handle('window:maximize', (_) => {
    return BrowserWindow.fromId(_.frameId)?.maximize()
  })
  // 取消最大化当前窗口
  ipcMain.handle('window:unmaximize', (_) => {
    return BrowserWindow.fromId(_.frameId)?.unmaximize()
  })
  // 是否最大化
  ipcMain.handle('window:is-maximized', (_) => {
    return BrowserWindow.fromId(_.frameId)?.isMaximized()
  })
  // 切换最大化
  ipcMain.handle('window:toggle-maximize', (_) => {
    return BrowserWindow.fromId(_.frameId)?.isMaximized()
      ? BrowserWindow.fromId(_.frameId)?.unmaximize()
      : BrowserWindow.fromId(_.frameId)?.maximize()
  })
  // 关闭当前窗口
  ipcMain.handle('window:close', (_) => {
    return BrowserWindow.fromId(_.frameId)?.close()
  })
  // 隐藏当前窗口
  ipcMain.handle('window:hide', (_) => {
    return BrowserWindow.fromId(_.frameId)?.hide()
  })
  // 显示当前窗口
  ipcMain.handle('window:show', (_) => {
    return BrowserWindow.fromId(_.frameId)?.show()
  })
  // 设置全屏
  ipcMain.handle('window:set-full-screen', (_) => {
    return BrowserWindow.fromId(_.frameId)?.setFullScreen(true)
  })
  // 取消全屏
  ipcMain.handle('window:unset-full-screen', (_) => {
    return BrowserWindow.fromId(_.frameId)?.setFullScreen(false)
  })
  // 是否全屏
  ipcMain.handle('window:is-full-screen', (_) => {
    return BrowserWindow.fromId(_.frameId)?.isFullScreen()
  })
  // 切换全屏
  ipcMain.handle('window:toggle-full-screen', (_) => {
    return BrowserWindow.fromId(_.frameId)?.isFullScreen()
      ? BrowserWindow.fromId(_.frameId)?.setFullScreen(false)
      : BrowserWindow.fromId(_.frameId)?.setFullScreen(true)
  })
  // 打开开发者工具
  ipcMain.handle('window:open-devtools', (_) => {
    return BrowserWindow.fromId(_.frameId)?.webContents.openDevTools()
  })
  // 关闭开发者工具
  ipcMain.handle('window:close-devtools', (_) => {
    return BrowserWindow.fromId(_.frameId)?.webContents.closeDevTools()
  })
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
  // 获取所有窗口
  getAllWindows(): Promise<Electron.BrowserWindow[]> {
    return ipcRenderer.invoke('window:get-all-windows')
  },
  // 获取当前窗口
  getCurrentWindow(): Promise<Electron.BrowserWindow | null> {
    return ipcRenderer.invoke('window:get-current-window')
  },
  // 最小化当前窗口
  minimize(): Promise<void> {
    return ipcRenderer.invoke('window:minimize')
  },
  // 最大化当前窗口
  maximize(): Promise<void> {
    return ipcRenderer.invoke('window:maximize')
  },
  // 取消最大化当前窗口
  unmaximize(): Promise<void> {
    return ipcRenderer.invoke('window:unmaximize')
  },
  // 是否最大化
  isMaximized(): Promise<boolean> {
    return ipcRenderer.invoke('window:is-maximized')
  },
  // 切换最大化
  toggleMaximize(): Promise<void> {
    return ipcRenderer.invoke('window:toggle-maximize')
  },
  // 关闭当前窗口
  close(): Promise<void> {
    return ipcRenderer.invoke('window:close')
  },
  // 隐藏当前窗口
  hide(): Promise<void> {
    return ipcRenderer.invoke('window:hide')
  },
  // 显示当前窗口
  show(): Promise<void> {
    return ipcRenderer.invoke('window:show')
  },
  // 设置全屏
  setFullScreen(): Promise<void> {
    return ipcRenderer.invoke('window:set-full-screen')
  },
  // 取消全屏
  unsetFullScreen(): Promise<void> {
    return ipcRenderer.invoke('window:unset-full-screen')
  },
  // 是否全屏
  isFullScreen(): Promise<boolean> {
    return ipcRenderer.invoke('window:is-full-screen')
  },

  // 切换全屏
  toggleFullScreen(): Promise<void> {
    return ipcRenderer.invoke('window:toggle-full-screen')
  },
  // 打开开发者工具
  openDevTools(): Promise<void> {
    return ipcRenderer.invoke('window:open-devtools')
  },
  // 关闭开发者工具
  closeDevTools(): Promise<void> {
    return ipcRenderer.invoke('window:close-devtools')
  },
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
