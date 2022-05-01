export const Home = () => {
  // function send(message: string) {
  //   return new Promise((resolve) => {
  //     ipcRenderer.once('pew-reply', (_, arg) => {
  //       resolve(arg);
  //     });
  //     ipcRenderer.send('pew-message', message);
  //   });
  // }

  const handleButton = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      // eslint-disable-next-line no-console
      console.log('++++++++++++', arg);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  };
  const handleDropUsers = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      // eslint-disable-next-line no-console
      console.log('++++++++++++', arg);
    });
    window.electron.ipcRenderer.messageDB('DROP TABLE users');
  };
  const handleInsertUser = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      // eslint-disable-next-line no-console
      console.log('++++++++++++', arg);
    });
    window.electron.ipcRenderer.messageDB(
      'INSERT INTO users (fname, lname, address, phone, note) VALUES ("Petar", "Petrovic", "adresa 1", "333333", "null")'
    );
  };
  return (
    <div>
      <button type="button" onClick={handleButton}>
        Test IPC
      </button>
      <button type="button" onClick={handleDropUsers}>
        drop users
      </button>
      <button type="button" onClick={handleInsertUser}>
        insert user
      </button>
    </div>
  );
};

export default Home;
