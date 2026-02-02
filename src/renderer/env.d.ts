/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ElectronAPI {
  openFile(): Promise<string[] | null>
  saveFile(): Promise<string | null>
  readFile(path: string): Promise<string>
  writeFile(path: string, data: string): Promise<boolean>
  minimizeWindow(): Promise<void>
  maximizeWindow(): Promise<boolean>
  closeWindow(): Promise<void>
  isMaximized(): Promise<boolean>
  setWindowSize(width: number, height: number): Promise<void>
}

interface Window {
  electronAPI: ElectronAPI
}
