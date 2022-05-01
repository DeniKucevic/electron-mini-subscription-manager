import React, { useEffect, useState } from 'react';
import { BclModal } from 'renderer/components/bcl-modal';

import useModal from 'renderer/hooks/useModal';

type User = {
  id: number;
  fname: string;
  lname: string;
  address: string;
  phone: string;
  note: string;
};

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { isShowing, toggle } = useModal();

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
            <th>id</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.note}</td>
              <td>
                <div className="btn-group">
                  <button type="button" className="btn btn-mini btn-default">
                    <span className="icon icon-home" />
                  </button>
                  <button type="button" className="btn btn-mini btn-default">
                    <span className="icon icon-shuffle" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="btn btn-large btn-default"
        onClick={toggle}
      >
        <span className="icon icon-user-add" />
        Insert new user
      </button>
      <BclModal isShowing={isShowing} hide={toggle}>
        <form>
          <div className="form-group">
            <label htmlFor="email">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
              />
              Email address
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
              />
              Password
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="textarea">
              <textarea className="form-control" rows={3} />
              Description
            </label>
          </div>
          <select className="form-control">
            <option>Option one</option>
            <option>Option two</option>
            <option>Option three</option>
            <option>Option four</option>
            <option>Option five</option>
            <option>Option six</option>
            <option>Option seven</option>
            <option>Option eight</option>
          </select>
          <div className="checkbox">
            <label htmlFor="checkbox">
              <input type="checkbox" /> This is a checkbox
            </label>
          </div>
          <div className="checkbox">
            <label htmlFor="checkbox">
              <input type="checkbox" /> This is a checkbox too
            </label>
          </div>
          <div className="radio">
            <label htmlFor="radio">
              <input type="radio" name="radios" checked />
              Keep your options open
            </label>
          </div>
          <div className="radio">
            <label htmlFor="radio">
              <input type="radio" name="radios" />
              Be sure to remember to check for unknown unknowns
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-form btn-default">
              Cancel
            </button>
            <button type="submit" className="btn btn-form btn-primary">
              OK
            </button>
          </div>
        </form>
      </BclModal>
    </div>
  );
};

export default Users;
