import { ipcMain } from 'electron';
import { db } from '../../db/db.config';
// TODO: fix error handling in both controllers
ipcMain.on('get-all-sub-models', async (event) => {
  const sql = 'SELECT * FROM subscription_models';
  db.all(sql, (err, rows) => {
    if (err) {
      event.reply('error', err);
      return;
    }
    event.reply('models', rows);
  });
});

ipcMain.on(
  'sort-sub-models',
  async (event, arg: { sort: string; sortDirection: 'ASC' | 'DESC' }) => {
    const { sort, sortDirection } = arg;
    const sql = `SELECT * FROM subscription_models ORDER BY "${sort}" ${sortDirection}`;
    db.all(sql, (err, rows) => {
      if (err) {
        event.reply('error', err);
        return;
      }
      event.reply('models', rows);
    });
  }
);

ipcMain.on(
  'insert-sub-model',
  async (
    event,
    arg: {
      modelName: string;
      modelValue: string;
      modelModifier: string;
    }
  ) => {
    const { modelModifier, modelName, modelValue } = arg;
    const sql = `INSERT INTO subscription_models (name, value, modifier) VALUES ("${modelName}", "${modelValue}", "${modelModifier}")`;
    db.all(sql, (err) => {
      if (err) {
        event.reply('error', err);
        return;
      }
      db.all('SELECT * FROM subscription_models', (err2, rows) => {
        if (err2) {
          event.reply('error', err2);
          return;
        }
        event.reply('models', rows);
      });
    });
  }
);

ipcMain.on('delete-sub-model', async (event, arg: { id: number }) => {
  const { id } = arg;
  const sql = `DELETE FROM subscription_models WHERE id = ${id}`;
  db.all(sql, (err) => {
    if (err) event.reply('error', err);
    db.all('SELECT * FROM subscription_models', (err2, rows) => {
      if (err2) {
        event.reply('error', err2);
        return;
      }
      event.reply('models', rows);
    });
  });
});
