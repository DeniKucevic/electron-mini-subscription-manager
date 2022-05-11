import React from 'react';

import { addMonths, differenceInDays, format, isAfter } from 'date-fns';
import { srLatn } from 'date-fns/locale';
import { useConfirmationDialog } from 'renderer/context/confirmation-dialog';

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
};

export const UserTable: React.FC<UserTableProps> = ({
  handleSort,
  handleUserModal,
  users,
}) => {
  const today = new Date();
  const { getConfirmation } = useConfirmationDialog();

  const handleAddMonth = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    subscription_end: string,
    fname: string,
    lname: string
  ) => {
    e.stopPropagation();
    let newSubEnd: string;
    let newSubStart: string;
    if (isAfter(today, Date.parse(subscription_end))) {
      newSubEnd = addMonths(today, 1).toISOString();
      newSubStart = today.toISOString();
    } else {
      newSubEnd = addMonths(Date.parse(subscription_end), 1).toISOString();
      newSubStart = subscription_end;
    }

    const confirmed = await getConfirmation({
      title: 'Attention!',
      message: `Extend ${fname} ${lname} subscription from: ${format(
        Date.parse(newSubStart),
        'dd. MMMM yyyy.'
      )} to: ${format(Date.parse(newSubEnd), 'dd. MMMM yyyy.')}`,
    });

    if (confirmed) {
      window.electron.ipcRenderer.messageDB(
        `UPDATE users
        SET subscription_end = "${newSubEnd}",
        subscription_start = "${subscription_end}"
        WHERE
        id = ${id}`
      );
    }
  };

  const handleSubscriptionStatus = (subscriptionEnd: string) => {
    if (isAfter(today, Date.parse(subscriptionEnd)))
      return <span className="icon icon-db-shape" style={{ color: 'red' }} />;
    if (differenceInDays(Date.parse(subscriptionEnd), today) >= 3)
      return <span className="icon icon-db-shape" style={{ color: 'green' }} />;

    return <span className="icon icon-db-shape" style={{ color: 'orange' }} />;
  };

  const handleSingleRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    fname: string,
    lname: string
  ) => {
    e.stopPropagation();
    const confirmed = await getConfirmation({
      title: 'Attention!',
      message: `Are you sure you want to remove ${fname} ${lname} from database?`,
    });

    if (confirmed) {
      window.electron.ipcRenderer.deleteUser({ id });
    }
  };

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
                        handleAddMonth(
                          e,
                          user.id,
                          user.subscription_end,
                          user.fname,
                          user.lname
                        )
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
