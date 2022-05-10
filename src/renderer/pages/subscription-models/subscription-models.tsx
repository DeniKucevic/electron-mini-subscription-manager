/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { BclModal } from 'renderer/components/bcl-modal';
import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

type SubscriptionModelType = {
  id: number;
  name: string;
  value: string;
  modifier: string;
};

export const SubscriptionModel: React.FC = () => {
  const [models, setModels] = useState<SubscriptionModelType[]>([]);
  const [lastSortDirection, setLastSortDirection] = useState<'ASC' | 'DESC'>(
    'DESC'
  );

  const [modelName, setModelName] = useState('');
  const [modelValue, setModelValue] = useState('1');
  const [modelModifier, setModelModifier] = useState<
    'day' | 'month' | 'year' | string
  >('day');

  const [isShowing, toggle] = useModal();

  const fetchModels = () => {
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      setModels(arg as []);
    });
    window.electron.ipcRenderer.messageDB('SELECT * FROM subscription_models');
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSort = (sort: string) => {
    setLastSortDirection(lastSortDirection === 'ASC' ? 'DESC' : 'ASC');

    window.electron.ipcRenderer.messageDB(
      `SELECT * FROM subscription_models ORDER BY "${sort}" ${lastSortDirection}`
    );
    window.electron.ipcRenderer.once('DB-request', (args) => {
      setModels(args as SubscriptionModelType[]);
    });
  };

  const handleNewModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electron.ipcRenderer.messageDB(
      `INSERT INTO subscription_models (name, value, modifier) VALUES ("${modelName}", "${modelValue}", "${modelModifier}")`
    );
    window.electron.ipcRenderer.once('DB-request', (...args: any) => {
      if (args[0].length === 0) {
        fetchModels();
      } else {
        window.alert(
          `Subscription model with name ${modelName} already exists!`
        );
      }
    });
    toggle();
  };

  const handleSingleRemove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    name: string
  ) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to remove ${name} model from database? \n \n \n! 𝘛𝘩𝘪𝘴 𝘢𝘤𝘵𝘪𝘰𝘯 𝘪𝘴 𝘪𝘳𝘳𝘦𝘷𝘦𝘳𝘴𝘪𝘣𝘭𝘦 !`
      )
    ) {
      window.electron.ipcRenderer.messageDB(
        `DELETE FROM subscription_models WHERE id = ${id}`
      );
      window.electron.ipcRenderer.once('DB-request', () => {
        fetchModels();
      });
    }
  };

  return (
    // <div>
    //   here should be a different models for subscription (1 motnh, 10 days,
    //   ...etc) and user should be able to make new ones, delete unwanted ones,
    //   alter maybe?, also this should fill the select when creating user or
    //   adding subscription
    // </div>
    <div>
      <Header>
        <div className="toolbar-actions">
          <button
            type="button"
            className={`btn pull-right btn-${
              models.length <= 6 ? 'default' : 'negative'
            }`}
            onClick={toggle}
            disabled={models.length >= 6}
          >
            <span className="icon icon-plus-circled icon-text" />
            Insert new model
          </button>
        </div>
      </Header>
      <table className="table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>id</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('value')}>Value</th>
            <th onClick={() => handleSort('modifier')}>Modifier</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {models.length > 0 &&
            models.map((model: SubscriptionModelType) => (
              <tr key={model.id}>
                <td>{model.id}</td>
                <td>{model.name}</td>
                <td>{model.value}</td>
                <td>{model.modifier}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-mini btn-default"
                      onClick={(e) =>
                        handleSingleRemove(e, model.id, model.name)
                      }
                    >
                      <span className="icon icon-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <BclModal isShowing={isShowing} hide={toggle}>
        <form onSubmit={(e) => handleNewModel(e)}>
          <div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                autoFocus
                required
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                placeholder="Value"
                className="form-control"
                onChange={(e) => setModelValue(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              Subscription:
              <select
                className="form-control"
                defaultValue="day"
                onChange={(e) => setModelModifier(e.target.value)}
              >
                <option value="day">day</option>
                <option value="month">month</option>
                <option value="year">year</option>
              </select>
            </div>
          </div>
          <div
            className="form-actions"
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >
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
      </BclModal>
    </div>
  );
};

export default SubscriptionModel;
