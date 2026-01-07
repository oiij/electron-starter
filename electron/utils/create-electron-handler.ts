import type { IpcMainInvokeEvent } from 'electron'
import { ipcMain, ipcRenderer } from 'electron'

export function createElectronHandler<A, R>(channel: string, func: (event: IpcMainInvokeEvent, args: A[]) => R) {
  function handle() {
    return ipcMain.handle(channel, (event: IpcMainInvokeEvent, args: A[]) => {
      return func(event, args)
    })
  }
  function invoke(args: A[]): Promise<R> {
    return ipcRenderer.invoke(channel, args)
  }
  return [handle, invoke] as const
}
