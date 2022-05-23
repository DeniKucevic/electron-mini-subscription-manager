import sqlite from 'sqlite3';
import { app } from 'electron';

const sqlite3 = sqlite.verbose();

const path = app.getPath('appData');
export const db = new sqlite3.Database(
  `${path}/macaw/db.sqlite3`,
  // eslint-disable-next-line no-bitwise
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Database opening error: ', err);
    } else {
      console.log('Successfully connected to the database');
    }
  }
);

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, email TEXT, address TEXT, phone TEXT, note TEXT, subscription_start TEXT NOT NULL, subscription_end TEXT NOT NULL)'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS subscription_models ("id" INTEGER PRIMARY KEY, "name" TEXT NOT NULL UNIQUE, "value" TEXT NOT NULL, "modifier" TEXT NOT NULL)'
  );
});

export default db;
