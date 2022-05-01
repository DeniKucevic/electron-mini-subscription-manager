import React, { useEffect, useState } from 'react';

type User = {
  fname: string;
  lname: string;
  address: string;
  phone: string;
  note: string;
};

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      // eslint-disable-next-line no-console
      console.log('++++++++++++', arg);
      setUsers(arg as User[]);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  }, []);

  return (
    <div>
      <table className="table-striped">
        <thead>
          <tr>
            {users[0] &&
              Object.keys(users[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user: User, i) => (
            <tr key={`${user.fname}-${i}`}>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-large btn-default">
        <span className="icon icon-user-add" /> insert new user
      </button>
    </div>
  );
};

export default Users;
