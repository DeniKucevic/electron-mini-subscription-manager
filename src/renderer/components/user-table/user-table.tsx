import React from 'react';

import { addMonths, differenceInDays, format, isAfter } from 'date-fns';
import { srLatn, sr, enUS } from 'date-fns/locale';
import { useConfirmationDialog } from 'renderer/context/confirmation-dialog';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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

export type UserTableProps = {
  handleSort: (sort: string) => void;
  handleUserModal: (user: User) => void;
  users: User[];
  inactiveUsers?: boolean;
};

export const UserTable: React.FC<UserTableProps> = ({
  handleSort,
  handleUserModal,
  users,
  inactiveUsers,
}) => {
  const today = new Date();
  const { t } = useTranslation();
  const { getConfirmation } = useConfirmationDialog();

  const getLocale = () => {
    const selected = i18next.language;
    switch (selected) {
      case 'en':
        return enUS;
      case 'sr':
        return srLatn;
      case 'cp':
        return sr;
      default:
        return enUS;
    }
  };

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
      title: t('common:messages.title'),
      message: t('common:messages.extend-subscription', {
        fname,
        lname,
        dateFrom: format(Date.parse(newSubStart), 'dd. MMMM yyyy.', {
          locale: getLocale(),
        }),
        dateTo: format(Date.parse(newSubEnd), 'dd. MMMM yyyy.', {
          locale: getLocale(),
        }),
      }),
    });

    if (confirmed) {
      window.electron.ipcRenderer.updateUserSubscription({
        id,
        newSubEnd,
        newSubStart: subscription_end,
      });
    }
  };

  const handleSubscriptionStatus = (
    subscriptionEnd: string,
    inactive: boolean
  ) => {
    if (inactive) {
      return <span className="icon icon-db-shape" style={{ color: 'gray' }} />;
    }
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
      title: t('common:messages.title'),
      message: t('common:messages.remove-user', {
        fname,
        lname,
      }),
    });

    if (confirmed) {
      window.electron.ipcRenderer.deleteUser({ id });
    }
  };

  const handleMarkAsInactive = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    fname: string,
    lname: string,
    inactiveUsers?: boolean
  ) => {
    e.stopPropagation();
    const confirmed = await getConfirmation({
      title: t('common:messages.title'),
      message: inactiveUsers
        ? ''
        : t('common:messages.deactivate-user', {
            fname,
            lname,
          }),
    });

    if (confirmed) {
      if (inactiveUsers) {
        window.electron.ipcRenderer.activateUser({ id });
      } else {
        window.electron.ipcRenderer.deactivateUser({ id });
      }
    }
  };

  return (
    <table className="table-striped">
      <thead>
        <tr>
          <th onClick={() => handleSort('id')}>{t('common:user-table.id')}</th>
          <th onClick={() => handleSort('fname')}>
            {t('common:user-table.first-name')}
          </th>
          <th onClick={() => handleSort('lname')}>
            {t('common:user-table.last-name')}
          </th>
          <th onClick={() => handleSort('lname')}>{t('common:commons.tel')}</th>
          <th onClick={() => handleSort('note')}>
            {t('common:user-table.note')}
          </th>
          <th onClick={() => handleSort('subscription_start')}>
            {t('common:user-table.sub-start')}
          </th>
          <th onClick={() => handleSort('subscription_end')}>
            {t('common:user-table.sub-end')}
          </th>
          <th>{t('common:user-table.status')}</th>
          <th>{t('common:user-table.actions')}</th>
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
                <td>{user.phone}</td>
                <td style={{ color: user.note === 'null' ? 'lightgray' : '' }}>
                  {user.note}
                </td>
                <td>
                  {format(
                    Date.parse(user.subscription_start),
                    'dd. MMMM yyyy.',
                    {
                      locale: getLocale(),
                    }
                  )}
                </td>
                <td>
                  {' '}
                  {format(Date.parse(user.subscription_end), 'dd. MMMM yyyy.', {
                    locale: getLocale(),
                  })}
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {handleSubscriptionStatus(
                    user.subscription_end,
                    user.inactive
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    {inactiveUsers ? null : (
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
                    )}
                    {inactiveUsers ? null : (
                      <button
                        type="button"
                        className="btn btn-mini btn-default"
                        onClick={(e) =>
                          handleSingleRemove(e, user.id, user.fname, user.lname)
                        }
                      >
                        <span className="icon icon-trash" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-mini btn-default"
                      onClick={(e) =>
                        handleMarkAsInactive(
                          e,
                          user.id,
                          user.fname,
                          user.lname,
                          inactiveUsers
                        )
                      }
                    >
                      <span className="icon icon-logout" />
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
