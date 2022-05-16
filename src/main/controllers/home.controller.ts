import { addDays, isAfter, isBefore } from 'date-fns';
import { ipcMain } from 'electron';
import { db } from '../../db/db.config';

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

ipcMain.on('home-chart', async (event, arg: { today: Date }) => {
  const { today } = arg;
  const result = {
    chart: [] as any[],
    toExpire: [] as any[],
  };
  const sql = `SELECT id, COUNT(*) AS total,
       SUM(CASE WHEN subscription_end < "${today.toISOString()}" THEN 1 ELSE 0 END) expired_count,
       SUM(CASE WHEN subscription_end > "${today.toISOString()}" THEN 1 ELSE 0 END) valid_count
       FROM users`;
  db.all(sql, (err, rows) => {
    result.chart = rows;
    db.all(
      `SELECT * FROM users WHERE subscription_end > "${today.toISOString()}" ORDER BY subscription_end ASC LIMIT 10`,
      (err1, rows1) => {
        result.toExpire = rows1.filter((user) => {
          const startDate = addDays(new Date(user.subscription_end), -3);
          const endDate = new Date(user.subscription_end);
          return today > startDate && today < endDate;
        });
        event.reply('home', result);
      }
    );
  });
});
