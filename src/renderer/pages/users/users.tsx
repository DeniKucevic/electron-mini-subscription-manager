import React, { useEffect, useState } from 'react';

import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

import { AddUserModal } from 'renderer/components/add-user-modal';
import { EditUserModal } from 'renderer/components/edit-user-modal/edit-user-modal';

import { UserTable } from 'renderer/components/user-table';
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

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [lastSortDirection, setLastSortDirection] = useState<'ASC' | 'DESC'>(
    'DESC'
  );

  const [selectedUser, setSelectedUser] = useState({} as User);

  const [isShowing, toggle] = useModal();
  const [isShowingUser, toggleUser] = useModal();

  const fetchUsers = () => {
    window.electron.ipcRenderer.messageDB('SELECT * FROM users');
  };

  window.electron.ipcRenderer.once('DB-request', (arg) => {
    console.log('oops', arg);
    if (arg[0] && arg[0].fname) {
      setUsers(arg as User[]);
    }
  });

  useEffect(() => {
    if (!isShowing) fetchUsers();
  }, [isShowing]);

  const handleUserModal = (user: User) => {
    setSelectedUser(user);
    toggleUser();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    window.electron.ipcRenderer.messageDB(
      `SELECT * FROM users WHERE fname LIKE "%${e.target.value}%" OR lname LIKE "%${e.target.value}%"`
    );
  };

  const handleSort = (sort: string) => {
    setLastSortDirection(lastSortDirection === 'ASC' ? 'DESC' : 'ASC');

    window.electron.ipcRenderer.messageDB(
      `SELECT * FROM users WHERE fname LIKE "%${search}%" OR lname LIKE "%${search}%" ORDER BY "${sort}" ${lastSortDirection}`
    );
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

          <button
            type="button"
            className="btn btn-default"
            onClick={() =>
              window.electron.ipcRenderer.messageDB('SELECT * FROM users')
            }
          >
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
        handleSort={handleSort}
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
