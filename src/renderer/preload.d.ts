declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        fixInput(): void;
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
