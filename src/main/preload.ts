import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing(arg: string | null) {
      ipcRenderer.send('ipc-test', arg);
    },
    checkForUpdates(arg: string | null) {
      ipcRenderer.send('updates-check', arg);
    },

    // HOME
    getHomeChart(arg: { today: Date }) {
      ipcRenderer.send('home-chart', arg);
    },
    // USERS
    getAllUsers() {
      ipcRenderer.send('get-all-users');
    },
    searchUsers(arg: string) {
      ipcRenderer.send('search-users', arg);
    },
    sortUsers(arg: {
      search: string;
      sort: string;
      sortDirection: 'ASC' | 'DESC';
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
    updateUserSubscription(request: {
      id: number;
      newSubEnd: string;
      newSubStart: string;
    }) {
      ipcRenderer.send('update-user-subscription', request);
    },
    // MODELS
    getAllSubModels() {
      ipcRenderer.send('get-all-sub-models');
    },
    sortSubModels(request: { sort: string; sortDirection: 'ASC' | 'DESC' }) {
      ipcRenderer.send('sort-sub-models', request);
    },
    insertSubModel(request: {
      modelName: string;
      modelValue: string;
      modelModifier: string;
    }) {
      ipcRenderer.send('insert-sub-model', request);
    },
    deleteSubModel(request: { id: number }) {
      ipcRenderer.send('delete-sub-model', request);
    },
    //

    on(channel: string, func: (...args: unknown[]) => void) {
      const validChannels = [
        'ipc-test',
        'home',
        'users',
        'models',
        'version',
        'error',
      ];
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
      const validChannels = [
        'ipc-test',
        'home',
        'users',
        'models',
        'version',
        'error',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
});
