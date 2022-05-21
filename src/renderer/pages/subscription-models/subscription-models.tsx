/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BclModal } from 'renderer/components/bcl-modal';
import { useConfirmationDialog } from 'renderer/context/confirmation-dialog';
import useModal from 'renderer/hooks/useModal';
import { Header } from 'renderer/layouts/header';

type SubscriptionModelType = {
  id: number;
  name: string;
  value: string;
  modifier: string;
};

export const SubscriptionModel: React.FC = () => {
  const { t } = useTranslation();
  const { getConfirmation } = useConfirmationDialog();

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

  window.electron.ipcRenderer.once('models', (arg) => {
    setModels(arg as []);
  });

  useEffect(() => {
    window.electron.ipcRenderer.getAllSubModels();
  }, []);

  const handleSort = (sort: string) => {
    setLastSortDirection(lastSortDirection === 'ASC' ? 'DESC' : 'ASC');

    window.electron.ipcRenderer.sortSubModels({
      sort,
      sortDirection: lastSortDirection,
    });
  };

  const handleNewModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electron.ipcRenderer.insertSubModel({
      modelModifier,
      modelName,
      modelValue,
    });

    toggle();
  };

  const handleSingleRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
    name: string
  ) => {
    e.stopPropagation();
    const confirmed = await getConfirmation({
      title: t('common:messages.title'),
      message: t('common:messages.remove-model', {
        name,
      }),
    });

    if (confirmed) {
      window.electron.ipcRenderer.deleteSubModel({ id });
    }
  };

  const getTranslatedModifier = (modifier: string) => {
    switch (modifier) {
      case 'day':
        return t('common:commons.day' as any);
      case 'month':
        return t('common:commons.month' as any);
      case 'year':
        return t('common:commons.year' as any);

      default:
        return 'unknown';
    }
  };

  return (
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
            {t('common:subscription-models.insert-new-model')}
          </button>
        </div>
      </Header>
      <table className="table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>id</th>
            <th onClick={() => handleSort('name')}>
              {t('common:subscription-models.name')}
            </th>
            <th onClick={() => handleSort('value')}>
              {t('common:subscription-models.value')}
            </th>
            <th onClick={() => handleSort('modifier')}>
              {t('common:subscription-models.modifier')}
            </th>
            <th>{t('common:subscription-models.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {models.length > 0 &&
            models.map((model: SubscriptionModelType) => (
              <tr key={model.id}>
                <td>{model.id}</td>
                <td>{model.name}</td>
                <td>{model.value}</td>
                <td>{getTranslatedModifier(model.modifier)}</td>
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
              <label>{t('common:subscription-models.name')}:</label>
              <input
                type="text"
                placeholder={t('common:subscription-models.name')}
                className="form-control"
                autoFocus
                required
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('common:subscription-models.value')}:</label>
              <input
                type="number"
                placeholder={t('common:subscription-models.value')}
                className="form-control"
                onChange={(e) => setModelValue(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              {t('common:subscription-models.modifier')}:
              <select
                className="form-control"
                defaultValue="day"
                onChange={(e) => setModelModifier(e.target.value)}
              >
                <option value="day">
                  {t('common:subscription-models.select.days')}
                </option>
                <option value="month">
                  {t('common:subscription-models.select.months')}
                </option>
                <option value="year">
                  {t('common:subscription-models.select.years')}
                </option>
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
              {t('common:commons.cancel')}
            </button>
            <button type="submit" className="btn btn-form btn-primary">
              {t('common:commons.save')}
            </button>
          </div>
        </form>
      </BclModal>
    </div>
  );
};

export default SubscriptionModel;
