/* eslint-disable @typescript-eslint/naming-convention */
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

  window.electron.ipcRenderer.on('users', (arg) => {
    setUsers(arg as User[]);
  });

  useEffect(() => {
    window.electron.ipcRenderer.getAllUsers();
  }, []);

  const handleUserModal = (user: User) => {
    setSelectedUser(user);
    toggleUser();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    window.electron.ipcRenderer.searchUsers(e.target.value);
  };

  const handleSort = (sort: string) => {
    setLastSortDirection(lastSortDirection === 'ASC' ? 'DESC' : 'ASC');

    window.electron.ipcRenderer.sortUsers({
      search,
      sort,
      sortDirection: lastSortDirection,
    });
  };

  const handleUserEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      address,
      email,
      fname,
      id,
      lname,
      note,
      phone,
      subscription_end,
      subscription_start,
    } = selectedUser;
    window.electron.ipcRenderer.updateUsers({
      address,
      email,
      fname,
      id,
      lname,
      note,
      phone,
      subscriptionEnd: subscription_end,
      subscriptionStart: subscription_start,
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
