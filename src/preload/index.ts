import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  openFile: (): Promise<string[] | null> => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (): Promise<string | null> => ipcRenderer.invoke('dialog:saveFile'),
  readFile: (path: string): Promise<string> => ipcRenderer.invoke('file:read', path),
  writeFile: (path: string, data: string): Promise<boolean> =>
    ipcRenderer.invoke('file:write', path, data),
  minimizeWindow: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window:maximize'),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('window:close'),
  isMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:isMaximized'),
  setWindowSize: (width: number, height: number): Promise<void> =>
    ipcRenderer.invoke('window:setSize', width, height)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
