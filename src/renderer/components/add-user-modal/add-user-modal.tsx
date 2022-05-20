import React, { useState, useEffect } from 'react';

import { addDays, addYears, addMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { BclModal } from '../bcl-modal';

type SubscriptionModelType = {
  id: number;
  name: string;
  value: string;
  modifier: string;
};

export type AddUserModalProps = {
  isShowing: boolean;
  toggle: () => void;
};

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isShowing,
  toggle,
}) => {
  const today = new Date();
  const { t } = useTranslation();

  const [models, setModels] = useState<SubscriptionModelType[]>([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState<string | null>('');
  const [address, setAddress] = useState<string | null>('');
  const [phone, setPhone] = useState<string | null>('');
  const [note, setNote] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState(1);

  window.electron.ipcRenderer.once('models', (args) => {
    setModels(args as SubscriptionModelType[]);
  });

  useEffect(() => {
    window.electron.ipcRenderer.getAllSubModels();
  }, []);

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
        prepareSubscriptionEnd = addMonths(
          today,
          selectedSubscription
        ).toISOString();
        break;
    }

    window.electron.ipcRenderer.insertUser({
      firstName,
      lastName,
      email,
      address,
      phone,
      note,
      subscriptionStart: today,
      subscriptionEnd: prepareSubscriptionEnd,
    });
    toggle();
  };

  return (
    <BclModal isShowing={isShowing} hide={toggle}>
      {models && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-group">
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className="form-control"
              placeholder={t('common:user-table.first-name')}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder={t('common:user-table.last-name')}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder={t('common:commons.email')}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('common:commons.address')}
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('common:commons.tel')}
            />
          </div>
          <div className="form-group">
            {t('common:user-table.note')}
            <textarea
              className="form-control"
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="form-group">
            {t('common:user-table.subscription')}
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

export default AddUserModal;
