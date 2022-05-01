import React, { useEffect, useState } from 'react';
import { addMonths, format } from 'date-fns';
import { srLatn } from 'date-fns/locale';
import { BclModal } from 'renderer/components/bcl-modal';

import useModal from 'renderer/hooks/useModal';

type User = {
  id: number;
  fname: string;
  lname: string;
  email: string;
  address: string;
  phone: string;
  note: string;
  subscription_start: string;
  subscription_end: string;
};

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState(1);
  const [subscriptionStart, setSubscriptionStart] = useState(
    new Date().toISOString()
  );

  const { isShowing, toggle } = useModal();

  const fetchUsers = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      setUsers(arg as User[]);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSingleRemove = (id: number) => {
    window.electron.ipcRenderer.messageDB(`DELETE FROM users WHERE id = ${id}`);
    window.electron.ipcRenderer.once('DB-request', () => {
      fetchUsers();
    });
  };

  const handleSubmit = () => {
    const prepareSubscriptionEnd = addMonths(
      Date.parse(subscriptionStart),
      selectedSubscription
    ).toISOString();
    window.electron.ipcRenderer.messageDB(
      `INSERT INTO users (fname, lname, email, address, phone, note, subscription_start, subscription_end) VALUES ("${firstName}", "${lastName}", "${email}", "${address}", "${phone}", "${note}", "${subscriptionStart}", "${prepareSubscriptionEnd}")`
    );
    window.electron.ipcRenderer.once('DB-request', () => {
      fetchUsers();
    });
    toggle();
  };

  return (
    <div>
      <table className="table-striped">
        <thead>
          <tr>
            <th>id</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>note</th>
            <th>Subscription start</th>
            <th>Subscription end</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td style={{ color: user.email === 'null' ? 'lightgray' : '' }}>
                {user.email}
              </td>
              <td style={{ color: user.address === 'null' ? 'lightgray' : '' }}>
                {user.address}
              </td>
              <td style={{ color: user.phone === 'null' ? 'lightgray' : '' }}>
                {user.phone}
              </td>
              <td style={{ color: user.note === 'null' ? 'lightgray' : '' }}>
                {user.note}
              </td>
              <td>
                {format(Date.parse(user.subscription_start), 'dd. MMMM yyyy.', {
                  locale: srLatn,
                })}
              </td>
              <td>
                {' '}
                {format(Date.parse(user.subscription_end), 'dd. MMMM yyyy.', {
                  locale: srLatn,
                })}
              </td>
              <td>
                <div className="btn-group">
                  <button type="button" className="btn btn-mini btn-default">
                    <span className="icon icon-plus-circled" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-mini btn-default"
                    onClick={() => handleSingleRemove(user.id)}
                  >
                    <span className="icon icon-trash" />
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
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </div>
          <div className="form-group">
            Note:
            <textarea
              className="form-control"
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="form-group">
            Subscription:
            <select
              className="form-control"
              defaultValue={1}
              onChange={(e) =>
                setSelectedSubscription(parseInt(e.target.value, 10))
              }
            >
              <option value={1}>One month</option>
              <option value={2}>Two months</option>
              <option value={3}>Three months</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-form btn-default"
              onClick={toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-form btn-primary"
              onClick={handleSubmit}
            >
              OK
            </button>
          </div>
        </form>
      </BclModal>
    </div>
  );
};

export default Users;
