import type { ElectronAPI } from '@electron-toolkit/preload'
import type { IpcRendererEvent } from 'electron'
import process from 'node:process'
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { electronPluginFetchPreloadRegister } from 'electron-plugin-fetch/preload'
import { windowExpose } from './window'

type Listener<T> = (event: IpcRendererEvent, ...args: T[]) => void
// Custom APIs for renderer
const api = {
  on<T>(channel: string, listener: Listener<T>) {
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  once<T>(channel: string, listener: Listener<T>) {
    return ipcRenderer.once(channel, (event, ...args) => listener(event, ...args))
  },
  off<T>(channel: string, listener: Listener<T>) {
    return ipcRenderer.off(channel, listener)
  },
  send(channel: string, ...args: any[]) {
    return ipcRenderer.send(channel, ...args)
  },
  invoke<T>(channel: string, ...args: any[]): Promise<T> {
    return ipcRenderer.invoke(channel, ...args)
  },
  postMessage(channel: string, message: any, transfer?: MessagePort[]) {
    return ipcRenderer.postMessage(channel, message, transfer)
  },
  window: windowExpose,
}
declare global {
  interface Window {
    electron: ElectronAPI
    api?: typeof api
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  window.electron = electronAPI
  window.api = api
}
electronPluginFetchPreloadRegister(contextBridge, ipcRenderer)
