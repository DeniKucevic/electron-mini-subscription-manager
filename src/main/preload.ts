import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-test', 'ping');
    },
    getUsers() {
      ipcRenderer.send('get-users');
    },
    users(request: UserProps) {
      ipcRenderer.send('users', request);
    },
    messageDB(request: string) {
      ipcRenderer.send('DB-request', request);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-test', 'DB-request', 'get-users', 'users'];
      if (validChannels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, subscription);

        return () => ipcRenderer.removeListener(channel, subscription);
      }

      return undefined;
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = ['ipc-test', 'DB-request', 'focus-fix'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
