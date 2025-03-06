import type { Expose } from './preload/index'

declare global {
  interface Window {
    ipcRenderer?: Expose
  }
}
