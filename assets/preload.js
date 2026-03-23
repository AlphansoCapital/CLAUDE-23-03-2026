const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  pickFolder:  ()          => ipcRenderer.invoke('pick-folder'),
  readFolder:  (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  openURL:     (url)        => ipcRenderer.invoke('open-url', url),
  getVersion:  ()           => ipcRenderer.invoke('get-version'),
});
