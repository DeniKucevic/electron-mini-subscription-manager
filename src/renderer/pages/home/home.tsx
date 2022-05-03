import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';

import 'chart.js/auto';

export const Home: React.FC = () => {
  const [count, setCount] = useState<any>([]);

  useEffect(() => {
    const today = new Date();
    window.electron.ipcRenderer.once('DB-request', (arg) => {
      setCount(arg as any);
    });
    window.electron.ipcRenderer.messageDB(
      `SELECT id, COUNT(*) AS total,
      SUM(CASE WHEN subscription_end < "${today.toISOString()}" THEN 1 ELSE 0 END) expired_count,
      SUM(CASE WHEN subscription_end > "${today.toISOString()}" THEN 1 ELSE 0 END) valid_count
      FROM users`
    );
    //     SELECT ProductID,
    //     COUNT(*) AS Total,
    //     SUM(CASE WHEN pStatus = 'delivered' THEN 1 ELSE 0 END) DeliveredCount,
    //     SUM(CASE WHEN pStatus = 'idle' THEN 1 ELSE 0 END) IdleCount,
    //     SUM(CASE WHEN pStatus = 'shipping' THEN 1 ELSE 0 END) ShippingCount,
    //     SUM(CASE WHEN pStatus = 'preparing' THEN 1 ELSE 0 END) PreparingCount
    // FROM ProductTable
    // GROUP BY ProductID
  }, []);

  const data = {
    labels: ['Valid users', 'Expired users'],
    datasets: [
      {
        label: '# of Users',
        data: [count[0]?.valid_count, count[0]?.expired_count],
        backgroundColor: [
          'green',
          'orange',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'green',
          'orange',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '30rem' }}>
      {/* some statistics should be here, like how many total users, how many active
      users, and users who subscription is about to expire
      <button type="button" onClick={() => console.log(count)}>
        COUNT
      </button> */}
      <Chart type="pie" data={data} />
    </div>
  );
};

export default Home;
