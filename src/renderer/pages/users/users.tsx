import React, { useEffect, useState } from 'react';
import {
  addMonths,
  addDays,
  addYears,
  differenceInDays,
  format,
  isAfter,
} from 'date-fns';
import { srLatn } from 'date-fns/locale';
import { BclModal } from 'renderer/components/bcl-modal';
import { DateRange } from 'react-date-range';

import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './users.css';

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

type SubscriptionModelType = {
  id: number;
  name: string;
  value: string;
  modifier: string;
};

export const Users: React.FC = () => {
  const today = new Date();

  const [users, setUsers] = useState<User[]>([]);
  const [models, setModels] = useState<SubscriptionModelType[]>([]);
  const [search, setSearch] = useState('');
  const [lastSortDirection, setLastSortDirection] = useState<'ASC' | 'DESC'>(
    'DESC'
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState(1);

  const [selectedUser, setSelectedUser] = useState({} as User);

  const [isShowing, toggle] = useModal();
  const [isShowingUser, toggleUser] = useModal();

  const fetchModels = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      setModels(arg as SubscriptionModelType[]);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM subscription_models');
  };

  const fetchUsers = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      setUsers(arg as User[]);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserModal = (user: User) => {
    setSelectedUser(user);
    toggleUser();
  };

  const handleSubscriptionStatus = (subscriptionEnd: string) => {
    if (isAfter(today, Date.parse(subscriptionEnd)))
      return <span className="icon icon-db-shape" style={{ color: 'red' }} />;
    if (differenceInDays(Date.parse(subscriptionEnd), today) >= 3)
      return <span className="icon icon-db-shape" style={{ color: 'green' }} />;

    return <span className="icon icon-db-shape" style={{ color: 'orange' }} />;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    window.electron.ipcRenderer.messageDB(
      `SELECT * FROM users WHERE fname LIKE "%${e.target.value}%" OR lname LIKE "%${e.target.value}%"`
    );
    window.electron.ipcRenderer.once('DB-request', (args) => {
      setUsers(args as User[]);
    });
  };

  const handleSort = (sort: string) => {
    setLastSortDirection(lastSortDirection === 'ASC' ? 'DESC' : 'ASC');

    window.electron.ipcRenderer.messageDB(
      `SELECT * FROM users WHERE fname LIKE "%${search}%" OR lname LIKE "%${search}%" ORDER BY "${sort}" ${lastSortDirection}`
    );
    window.electron.ipcRenderer.once('DB-request', (args) => {
      setUsers(args as User[]);
    });
  };

  const handleAddMonth = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
    subscription_end: string
  ) => {
    e.stopPropagation();
    const newSubEnd = addMonths(Date.parse(subscription_end), 1).toISOString();

    window.electron.ipcRenderer.messageDB(
      `UPDATE users
      SET subscription_end = "${newSubEnd}",
      subscription_start = "${subscription_end}"
      WHERE
      id = ${id}`
    );
    window.electron.ipcRenderer.once('DB-request', () => {
      fetchUsers();
    });
  };

  const handleSingleRemove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    fname: string,
    lname: string
  ) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to remove ${fname} ${lname} from database? \n \n \n! 𝘛𝘩𝘪𝘴 𝘢𝘤𝘵𝘪𝘰𝘯 𝘪𝘴 𝘪𝘳𝘳𝘦𝘷𝘦𝘳𝘴𝘪𝘣𝘭𝘦 !`
      )
    ) {
      window.electron.ipcRenderer.messageDB(
        `DELETE FROM users WHERE id = ${id}`
      );
      window.electron.ipcRenderer.once('DB-request', () => {
        fetchUsers();
      });
    }
  };

  const handleUserEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electron.ipcRenderer.messageDB(
      `UPDATE users
      SET fname = "${selectedUser.fname}",
      lname = "${selectedUser.lname}",
      email = "${selectedUser.email}",
      address = "${selectedUser.address}",
      phone = "${selectedUser.phone}",
      note = "${selectedUser.note}",
      subscription_start = "${selectedUser.subscription_start}",
      subscription_end = "${selectedUser.subscription_end}"
      WHERE
      id = ${selectedUser.id}`
    );
    window.electron.ipcRenderer.once('DB-request', () => {
      fetchUsers();
    });
    toggleUser();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const model = models.find((modelObj) => {
      return modelObj.id === selectedSubscription;
    });

    let prepareSubscriptionEnd;

    switch (model?.modifier) {
      case 'day':
        prepareSubscriptionEnd = addDays(
          today,
          selectedSubscription
        ).toISOString();
        break;
      case 'month':
        prepareSubscriptionEnd = addMonths(
          today,
          selectedSubscription
        ).toISOString();
        break;
      case 'year':
        prepareSubscriptionEnd = addYears(
          today,
          selectedSubscription
        ).toISOString();
        break;

      default:
        break;
    }

    window.electron.ipcRenderer.messageDB(
      `INSERT INTO users (fname, lname, email, address, phone, note, subscription_start, subscription_end) VALUES ("${firstName}", "${lastName}", "${email}", "${address}", "${phone}", "${note}", "${today}", "${prepareSubscriptionEnd}")`
    );
    window.electron.ipcRenderer.once('DB-request', () => {
      fetchUsers();
    });
    toggle();
  };

  return (
    <div>
      <Header>
        <div className="toolbar-actions">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearch(e)}
          />

          <button type="button" className="btn btn-default">
            <span className="icon icon-search icon-text" />
            Filters
          </button>

          <button
            type="button"
            className="btn btn-default pull-right"
            onClick={() => {
              fetchModels();
              toggle();
            }}
          >
            <span className="icon icon-user-add icon-text" />
            Insert new user
          </button>
        </div>
      </Header>
      <table className="table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>id</th>
            <th onClick={() => handleSort('fname')}>First name</th>
            <th onClick={() => handleSort('lname')}>Last name</th>
            <th onClick={() => handleSort('note')}>note</th>
            <th onClick={() => handleSort('subscription_start')}>
              Subscription start
            </th>
            <th onClick={() => handleSort('subscription_end')}>
              Subscription end
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user: User) => (
              <tr key={user.id} onClick={() => handleUserModal(user)}>
                <td>{user.id}</td>
                <td>{user.fname}</td>
                <td>{user.lname}</td>
                <td style={{ color: user.note === 'null' ? 'lightgray' : '' }}>
                  {user.note}
                </td>
                <td>
                  {format(
                    Date.parse(user.subscription_start),
                    'dd. MMMM yyyy.',
                    {
                      locale: srLatn,
                    }
                  )}
                </td>
                <td>
                  {' '}
                  {format(Date.parse(user.subscription_end), 'dd. MMMM yyyy.', {
                    locale: srLatn,
                  })}
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {handleSubscriptionStatus(user.subscription_end)}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-mini btn-default"
                      onClick={(e) =>
                        handleAddMonth(e, user.id, user.subscription_end)
                      }
                    >
                      <span className="icon icon-plus-circled" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-mini btn-default"
                      onClick={(e) =>
                        handleSingleRemove(e, user.id, user.fname, user.lname)
                      }
                    >
                      <span className="icon icon-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <BclModal isShowing={isShowing} hide={toggle}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-group">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
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
              defaultValue={models[0]?.id}
              onChange={(e) => {
                setSelectedSubscription(parseInt(e.target.value, 10));
              }}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
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
            <button type="submit" className="btn btn-form btn-primary">
              OK
            </button>
          </div>
        </form>
      </BclModal>
      <BclModal isShowing={isShowingUser} hide={toggleUser}>
        {Object.keys(selectedUser).length === 0 ? (
          ''
        ) : (
          <form onSubmit={(e) => handleUserEdit(e)}>
            <div className="popup_user_form">
              <div>
                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    defaultValue={selectedUser.fname}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        fname: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input
                    className="form-control"
                    defaultValue={selectedUser.lname}
                    required
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        lname: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    defaultValue={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    className="form-control"
                    defaultValue={selectedUser.address}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    defaultValue={selectedUser.note}
                    onChange={(e) =>
                      setSelectedUser((prevState) => ({
                        ...prevState,
                        note: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <DateRange
                  onChange={(item) => {
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      subscription_start:
                        item.selection.startDate!.toISOString(),
                      subscription_end: item.selection.endDate!.toISOString(),
                    }));
                  }}
                  months={1}
                  ranges={[
                    {
                      startDate: new Date(selectedUser.subscription_start),
                      endDate: new Date(selectedUser.subscription_end),
                      key: 'selection',
                    },
                  ]}
                />
              </div>
            </div>
            <div
              className="form-actions"
              style={{ textAlign: 'center', marginTop: '2rem' }}
            >
              <button
                type="button"
                className="btn btn-form btn-default"
                onClick={toggleUser}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-form btn-primary">
                OK
              </button>
            </div>
          </form>
        )}
      </BclModal>
    </div>
  );
};

export default Users;
