import type { BrowserWindow } from 'electron'
import { ipcRenderer } from 'electron'
import { windowInvokeMap as _WIM } from '../utils/invoke-maps'

export const windowExpose = {
  getAllWindow: (): Promise<BrowserWindow[]> => ipcRenderer.invoke(_WIM.GetAllWindows),
  getCurrentWindow: (): Promise<BrowserWindow> => ipcRenderer.invoke(_WIM.GetCurrentWindow),
  minimizeCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.MinimizeCurrentWindow),
  maximizeCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.MaximizeCurrentWindow),
  unMaximizeCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.UnMaximizeCurrentWindow),
  isMaximizedCurrentWindow: (): Promise<boolean> => ipcRenderer.invoke(_WIM.IsMaximizedCurrentWindow),
  toggleMaximizeCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.ToggleMaximizeCurrentWindow),
  closeCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.CloseCurrentWindow),
  hideCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.HideCurrentWindow),
  showCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.ShowCurrentWindow),
  setFullScreenCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.SetFullScreenCurrentWindow),
  unSetFullScreenCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.UnSetFullScreenCurrentWindow),
  isFullScreenCurrentWindow: (): Promise<boolean> => ipcRenderer.invoke(_WIM.IsFullScreenCurrentWindow),
  toggleFullScreenCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.ToggleFullScreenCurrentWindow),
  openDevToolsCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.OpenDevToolsCurrentWindow),
  closeDevToolsCurrentWindow: (): Promise<void> => ipcRenderer.invoke(_WIM.CloseDevToolsCurrentWindow),

}
