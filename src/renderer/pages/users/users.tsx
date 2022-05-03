import React, { useEffect, useState } from 'react';

import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

import { isAfter, addMonths, differenceInDays } from 'date-fns';

import { AddUserModal } from 'renderer/components/add-user-modal';
import { EditUserModal } from 'renderer/components/edit-user-modal/edit-user-modal';

import './users.css';
import { UserTable } from 'renderer/components/user-table';

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
  const today = new Date();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [lastSortDirection, setLastSortDirection] = useState<'ASC' | 'DESC'>(
    'DESC'
  );

  const [selectedUser, setSelectedUser] = useState({} as User);

  const [isShowing, toggle] = useModal();
  const [isShowingUser, toggleUser] = useModal();

  const fetchUsers = () => {
    window.electron.ipcRenderer.on('DB-request', (arg) => {
      if (arg[0] && arg[0].fname) {
        setUsers(arg as User[]);
      }
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  };

  useEffect(() => {
    if (!isShowing) fetchUsers();
  }, [isShowing]);

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
    id: number,
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
    window.electron.ipcRenderer.fixInput();
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
              toggle();
            }}
          >
            <span className="icon icon-user-add icon-text" />
            Insert new user
          </button>
        </div>
      </Header>
      <UserTable
        handleAddMonth={handleAddMonth}
        handleSingleRemove={handleSingleRemove}
        handleSort={handleSort}
        handleSubscriptionStatus={handleSubscriptionStatus}
        handleUserModal={handleUserModal}
        users={users}
      />
      <AddUserModal toggle={toggle} isShowing={isShowing} />
      <EditUserModal
        handleUserEdit={handleUserEdit}
        isShowingUser={isShowingUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        toggleUser={toggleUser}
      />
    </div>
  );
};

export default Users;
