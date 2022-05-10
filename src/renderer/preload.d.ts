declare global {
  type UserProps = {
    qry:
      | 'get-all-users'
      | 'get-user-by-id'
      | 'add-user'
      | 'update-user'
      | string;
    arg: string;
  };
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        getUsers(): void;
        users(request: UserProps): void;
        messageDB(request: string): void;
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
