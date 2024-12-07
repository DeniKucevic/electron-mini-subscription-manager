/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DateRange } from 'react-date-range';
import i18next from 'i18next';
import { enUS, sr, srLatn } from 'date-fns/locale';
import { BclModal } from '../bcl-modal';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export type EditUserModalProps = {
  isShowingUser: boolean;
  toggleUser: () => void;
  selectedUser: User;
  handleUserEdit: (e: React.FormEvent<HTMLFormElement>) => void;
  setSelectedUser: (value: React.SetStateAction<User>) => void;
};

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

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isShowingUser,
  toggleUser,
  handleUserEdit,
  selectedUser,
  setSelectedUser,
}) => {
  const { t } = useTranslation();

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
  return (
    <BclModal isShowing={isShowingUser} hide={toggleUser}>
      {Object.keys(selectedUser).length === 0 ? (
        ''
      ) : (
        <form onSubmit={(e) => handleUserEdit(e)}>
          <div className="popup_user_form">
            <div>
              <div className="form-group">
                <label>{t('common:user-table.first-name')}</label>
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
                <label>{t('common:user-table.last-name')}</label>
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
                <label>{t('common:commons.email')}</label>
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
                <label>{t('common:commons.tel')}</label>
                <input
                  className="form-control"
                  defaultValue={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser((prevState) => ({
                      ...prevState,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>{t('common:commons.address')}</label>
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
                <label>{t('common:user-table.note')}</label>
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
                locale={getLocale()}
                onChange={(item) => {
                  setSelectedUser((prevState) => ({
                    ...prevState,
                    subscription_start: item.selection.startDate
                      ? item.selection.startDate.toISOString()
                      : '',
                    subscription_end: item.selection.endDate
                      ? item.selection.endDate.toISOString()
                      : '',
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
              {t('common:commons.cancel')}
            </button>
            <button type="submit" className="btn btn-form btn-primary">
              {t('common:commons.save')}
            </button>
          </div>
        </form>
      )}
    </BclModal>
  );
};

export default EditUserModal;
