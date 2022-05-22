import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { Footer } from './footer';
import { Sidebar } from './sidebar';

import 'react-toastify/dist/ReactToastify.css';

export const DefaultLayout = () => {
  const notification = (arg: any) =>
    toast.error(`${arg.message}`, {
      position: toast.POSITION.TOP_CENTER,
      theme: 'colored',
      autoClose: 3000,
    });

  useEffect(() => {
    window.electron.ipcRenderer.on('error', (arg) => {
      notification(arg as any);
    });
  }, []);

  return (
    <div className="window">
      <ToastContainer autoClose={1000} />
      <div className="window-content">
        <div className="pane-group">
          <Sidebar />
          <main className="pane">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
