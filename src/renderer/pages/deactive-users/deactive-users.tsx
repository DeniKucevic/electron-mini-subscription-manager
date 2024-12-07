/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';

import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

import { AddUserModal } from 'renderer/components/add-user-modal';
import { EditUserModal } from 'renderer/components/edit-user-modal/edit-user-modal';

import { UserTable } from 'renderer/components/user-table';
import './users.css';
import { useTranslation } from 'react-i18next';

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
  inactive: boolean;
};

export const DeactiveUsers: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [lastSortDirection, setLastSortDirection] = useState<'ASC' | 'DESC'>(
    'DESC'
  );

  const [selectedUser, setSelectedUser] = useState({} as User);

  const [isShowingUser, toggleUser] = useModal();

  window.electron.ipcRenderer.once('users', (arg) => {
    setUsers(arg as User[]);
  });

  useEffect(() => {
    window.electron.ipcRenderer.getAllInactiveUsers();
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
            placeholder={t('common:user-table.search')}
            onChange={(e) => handleSearch(e)}
          />

          <button type="button" className="btn btn-default">
            <span className="icon icon-search icon-text" />
            {t('common:user-table.filters')}
          </button>
        </div>
      </Header>
      <UserTable
        handleSort={handleSort}
        handleUserModal={handleUserModal}
        users={users}
        inactiveUsers
      />
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

export default DeactiveUsers;
