import { BrowserWindow, nativeImage, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'

export function createTray() {
  const tray = new Tray(nativeImage.createFromPath(icon))
  tray.setToolTip('Electron Starter')

  tray.on('click', () => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.show()
    })
  })
  return tray
}
