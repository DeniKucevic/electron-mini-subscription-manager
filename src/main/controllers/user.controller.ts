import { ipcMain } from 'electron';
import { db } from '../../db/db.config';

ipcMain.on('get-all-users', async (event) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, (err, rows) => {
    if (err) {
      event.reply('error', err);
      return;
    }
    event.reply('users', rows);
  });
});

ipcMain.on('get-all-active-users', async (event) => {
  const sql = 'SELECT * FROM users WHERE inactive IS NULL';
  db.all(sql, (err, rows) => {
    if (err) {
      event.reply('error', err);
      return;
    }
    event.reply('users', rows);
  });
});

ipcMain.on('get-all-inactive-users', async (event) => {
  const sql = 'SELECT * FROM users WHERE inactive IS NOT NULL';
  db.all(sql, (err, rows) => {
    if (err) {
      event.reply('error', err);
      return;
    }
    event.reply('users', rows);
  });
});

ipcMain.on('search-users', async (event, arg: string) => {
  const sql = `SELECT * FROM users WHERE fname LIKE "%${arg}%" OR lname LIKE "%${arg}%"`;
  db.all(sql, (err, rows) => {
    if (err) {
      event.reply('error', err);
      return;
    }
    event.reply('users', rows);
  });
});

ipcMain.on(
  'sort-users',
  async (
    event,
    arg: { search: string; sort: string; sortDirection: 'ASC' | 'DESC' }
  ) => {
    const { search, sort, sortDirection } = arg;
    const sql = `SELECT * FROM users WHERE fname LIKE "%${search}%" OR lname LIKE "%${search}%" ORDER BY "${sort}" ${sortDirection}`;
    db.all(sql, (err, rows) => {
      if (err) {
        event.reply('error', err);
        return;
      }
      event.reply('users', rows);
    });
  }
);

ipcMain.on(
  'update-users',
  async (
    event,
    arg: {
      id: number;
      fname: string;
      lname: string;
      email: string;
      address: string;
      phone: string;
      note: string;
      subscriptionStart: string;
      subscriptionEnd: string;
    }
  ) => {
    const {
      id,
      fname,
      lname,
      address,
      email,
      note,
      phone,
      subscriptionEnd,
      subscriptionStart,
    } = arg;
    const sql = `UPDATE users
    SET fname = "${fname}",
    lname = "${lname}",
    email = "${email}",
    address = "${address}",
    phone = "${phone}",
    note = "${note}",
    subscription_start = "${subscriptionStart}",
    subscription_end = "${subscriptionEnd}"
    WHERE
    id = ${id}`;
    db.all(sql, (err) => {
      if (err) event.reply('error', err);
      db.all('SELECT * FROM users', (err2, rows) => {
        if (err) {
          event.reply('error', err2);
          return;
        }
        event.reply('users', rows);
      });
    });
  }
);

ipcMain.on('delete-user', async (event, arg: { id: number }) => {
  const { id } = arg;
  const sql = `DELETE FROM users WHERE id = ${id}`;
  db.all(sql, (err) => {
    if (err) event.reply('error', err);
    db.all('SELECT * FROM users', (err2, rows) => {
      if (err) {
        event.reply('error', err2);
        return;
      }
      event.reply('users', rows);
    });
  });
});

ipcMain.on('deactivate-user', async (event, arg: { id: number }) => {
  const { id } = arg;
  const sql = `UPDATE users SET inactive = 1 WHERE id = ${id}`;
  db.all(sql, (err) => {
    if (err) event.reply('error', err);
    db.all('SELECT * FROM users WHERE inactive IS NULL', (err2, rows) => {
      if (err) {
        event.reply('error', err2);
        return;
      }
      event.reply('users', rows);
    });
  });
});

ipcMain.on('activate-user', async (event, arg: { id: number }) => {
  const { id } = arg;
  const sql = `UPDATE users SET inactive = NULL WHERE id = ${id}`;
  db.all(sql, (err) => {
    if (err) event.reply('error', err);
    db.all('SELECT * FROM users WHERE inactive IS NOT NULL', (err2, rows) => {
      if (err) {
        event.reply('error', err2);
        return;
      }
      event.reply('users', rows);
    });
  });
});

ipcMain.on(
  'insert-user',
  async (
    event,
    arg: {
      firstName: string;
      lastName: string;
      address: string;
      email: string;
      note: string;
      phone: string;
      subscriptionStart: string;
      subscriptionEnd: string;
    }
  ) => {
    const {
      address,
      email,
      firstName,
      lastName,
      note,
      phone,
      subscriptionEnd,
      subscriptionStart,
    } = arg;
    const sql = `INSERT INTO users (fname, lname, email, address, phone, note, subscription_start, subscription_end) VALUES ("${firstName}", "${lastName}", "${email}", "${address}", "${phone}", "${note}", "${subscriptionStart}", "${subscriptionEnd}")`;
    db.all(sql, (err) => {
      if (err) event.reply('error', err);
      db.all('SELECT * FROM users WHERE inactive IS NULL', (err2, rows) => {
        if (err) {
          event.reply('error', err2);
          return;
        }
        event.reply('users', rows);
      });
    });
  }
);

ipcMain.on(
  'update-user-subscription',
  async (
    event,
    arg: {
      id: number;
      newSubEnd: string;
      newSubStart: string;
    }
  ) => {
    const { id, newSubEnd, newSubStart } = arg;
    const sql = `UPDATE users
    SET subscription_end = "${newSubEnd}",
    subscription_start = "${newSubStart}"
    WHERE
    id = ${id}`;
    db.all(sql, (err) => {
      if (err) event.reply('error', err);
      db.all('SELECT * FROM users', (err2, rows) => {
        if (err) {
          event.reply('error', err2);
          return;
        }
        event.reply('users', rows);
      });
    });
  }
);
