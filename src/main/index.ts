import { app, shell, BrowserWindow, ipcMain, dialog, nativeTheme } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    title: 'Contact Transfer',
    width: 960,
    height: 580,
    minWidth: 780,
    minHeight: 400,
    show: false,
    frame: false,
    icon: join(__dirname, '../../resources/icon.png'),
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#000000' : '#f5f5f7',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.androidtoiphone.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC: Open file dialog for .vcf files
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'vCard Files', extensions: ['vcf'] }]
    })
    if (result.canceled) return null
    return result.filePaths
  })

  // IPC: Save file dialog
  ipcMain.handle('dialog:saveFile', async () => {
    const result = await dialog.showSaveDialog({
      filters: [{ name: 'vCard File', extensions: ['vcf'] }],
      defaultPath: 'contacts.vcf'
    })
    if (result.canceled) return null
    return result.filePath
  })

  // IPC: Read file contents
  ipcMain.handle('file:read', async (_event, filePath: string) => {
    const data = await readFile(filePath, 'utf-8')
    return data
  })

  // IPC: Write file contents
  ipcMain.handle('file:write', async (_event, filePath: string, data: string) => {
    await writeFile(filePath, data, 'utf-8')
    return true
  })

  // IPC: Window controls
  ipcMain.handle('window:minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.handle('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
    return win?.isMaximized() ?? false
  })

  ipcMain.handle('window:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })

  ipcMain.handle('window:isMaximized', (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false
  })

  ipcMain.handle('window:setSize', (event, width: number, height: number) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isMaximized() && !win.isMinimized()) {
      const [currentWidth, currentHeight] = win.getSize()
      const [x, y] = win.getPosition()
      const newX = Math.round(x + (currentWidth - width) / 2)
      win.setBounds({ x: newX, y, width, height })
    }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
