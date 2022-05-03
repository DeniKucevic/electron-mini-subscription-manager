import React from 'react';

import { format } from 'date-fns';
import { srLatn } from 'date-fns/locale';

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

export type UserTableProps = {
  handleSort: (sort: string) => void;
  handleUserModal: (user: User) => void;
  users: User[];
  handleSubscriptionStatus: (subscriptionEnd: string) => JSX.Element;
  handleSingleRemove: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    fname: string,
    lname: string
  ) => void;
  handleAddMonth: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    subscription_end: string
  ) => void;
};

export const UserTable: React.FC<UserTableProps> = ({
  handleAddMonth,
  handleSingleRemove,
  handleSort,
  handleSubscriptionStatus,
  handleUserModal,
  users,
}) => {
  return (
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
        {users &&
          users.length > 0 &&
          users.map((user: User) => {
            return (
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
            );
          })}
      </tbody>
    </table>
  );
};
