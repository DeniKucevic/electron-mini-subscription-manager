import React, { useState, useEffect } from 'react';

import { addDays, addYears, addMonths } from 'date-fns';
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
  const [models, setModels] = useState<SubscriptionModelType[]>([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState(1);

  const fetchModels = () => {
    // window.electron.ipcRenderer.on('DB-request', (arg) => {
    //   setModels(arg as SubscriptionModelType[]);
    // });
    // window.electron.ipcRenderer.messageDB('SELECT * FROM subscription_models');
  };

  useEffect(() => {
    if (isShowing) {
      fetchModels();
    }
  }, [isShowing]);

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
      )}
    </BclModal>
  );
};

export default AddUserModal;
