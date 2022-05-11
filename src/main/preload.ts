import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-test', 'ping');
    },
    getAllUsers() {
      ipcRenderer.send('get-all-users');
    },
    searchUsers(arg: string) {
      ipcRenderer.send('search-users', arg);
    },
    sortUsers(arg: {
      search: string;
      sort: string;
      sortDirection: 'ASC' | 'DSC';
    }) {
      ipcRenderer.send('sort-users', arg);
    },
    updateUsers(arg: {
      id: string;
      fname: string;
      lname: string;
      email: string;
      address: string;
      phone: string;
      note: string;
      subscriptionStart: string;
      subscriptionEnd: string;
    }) {
      ipcRenderer.send('update-users', arg);
    },
    deleteUser(arg: { id: string }) {
      ipcRenderer.send('delete-user', arg);
    },
    users(request: UserProps) {
      ipcRenderer.send('users', request);
    },
    insertUser(request: {
      firstName: string;
      lastName: string;
      address: string;
      email: string;
      note: string;
      phone: string;
      subscriptionStart: string;
      subscriptionEnd: string;
    }) {
      ipcRenderer.send('insert-user', request);
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
