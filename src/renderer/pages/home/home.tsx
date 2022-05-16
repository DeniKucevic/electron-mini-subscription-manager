import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { differenceInDays, format, isAfter } from 'date-fns';
import { srLatn } from 'date-fns/locale';

import 'chart.js/auto';
import { useTranslation } from 'react-i18next';

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

export const Home: React.FC = () => {
  const today = new Date();

  const { t } = useTranslation('common');

  const [count, setCount] = useState<any[]>([]);
  const [usersToExpire, setUsersToExpire] = useState<any[]>([]);

  window.electron.ipcRenderer.once('home', (arg) => {
    const { chart, toExpire } = arg as {
      chart: any[];
      toExpire: any[];
    };
    setCount(chart);
    setUsersToExpire(toExpire);
  });

  useEffect(() => {
    window.electron.ipcRenderer.getHomeChart({ today: new Date() });
  }, []);

  const data = {
    labels: ['Valid users', 'Expired users'],
    datasets: [
      {
        label: '# of Users',
        data: [count[0]?.valid_count, count[0]?.expired_count],
        backgroundColor: ['green', 'red'],
        borderColor: ['green', 'red'],
        borderWidth: 1,
      },
    ],
  };

  const handleSubscriptionStatus = (subscriptionEnd: string) => {
    if (isAfter(today, Date.parse(subscriptionEnd)))
      return <span className="icon icon-db-shape" style={{ color: 'red' }} />;
    if (differenceInDays(Date.parse(subscriptionEnd), today) >= 3)
      return <span className="icon icon-db-shape" style={{ color: 'green' }} />;

    return <span className="icon icon-db-shape" style={{ color: 'orange' }} />;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {t('welcome.title', { framework: 'React' })}
      <div
        style={{
          padding: '1rem',
          margin: '3rem',
          flexGrow: '1',
        }}
      >
        <Chart type="pie" data={data} />
      </div>
      <div
        style={{
          flexGrow: '2',
        }}
      >
        <table className="table-striped">
          <thead>
            <tr>
              <th>id</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Subscription start</th>
              <th>Subscription end</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {usersToExpire &&
              usersToExpire.length > 0 &&
              usersToExpire.map((user: User) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fname}</td>
                    <td>{user.lname}</td>
                    <td>
                      {format(
                        Date.parse(user.subscription_start),
                        'dd. MMMM yyyy.',
                        {
                          locale: srLatn,
                        }
                      )}
                    </td>
                    <td>
                      {' '}
                      {format(
                        Date.parse(user.subscription_end),
                        'dd. MMMM yyyy.',
                        {
                          locale: srLatn,
                        }
                      )}
                    </td>
                    <td
                      style={{ textAlign: 'center', verticalAlign: 'middle' }}
                    >
                      {handleSubscriptionStatus(user.subscription_end)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
