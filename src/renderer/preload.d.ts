declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        checkForUpdates(): void;
        // HOME
        getHomeChart(arg: { today: Date }): void;
        // USERS
        getAllUsers(): void;
        searchUsers(arg: string): void;
        sortUsers(arg: {
          search: string;
          sort: string;
          sortDirection: 'ASC' | 'DESC';
        }): void;
        updateUsers(arg: {
          id: number;
          fname: string;
          lname: string;
          email: string;
          address: string;
          phone: string;
          note: string;
          subscriptionStart: string;
          subscriptionEnd: string;
        }): void;
        deleteUser(arg: { id: number }): void;
        insertUser(request: {
          firstName: string;
          lastName: string;
          address: string | null;
          email: string | null;
          note: string | null;
          phone: string | null;
          subscriptionStart: Date | string;
          subscriptionEnd: Date | string;
        }): void;
        updateUserSubscription(request: {
          id: number;
          newSubEnd: string;
          newSubStart: string;
        }): void;
        // MODELS
        getAllSubModels(): void;
        sortSubModels(request: {
          sort: string;
          sortDirection: 'ASC' | 'DESC';
        }): void;
        insertSubModel(request: {
          modelName: string;
          modelValue: string;
          modelModifier: string;
        }): void;
        deleteSubModel(request: { id: number }): void;
        //
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
