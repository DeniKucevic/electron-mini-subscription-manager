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
        users(request: UserProps): void;
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
