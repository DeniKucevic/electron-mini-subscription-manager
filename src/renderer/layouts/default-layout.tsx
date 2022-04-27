import { Outlet } from 'react-router-dom';

import { Footer } from './footer';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const DefaultLayout = () => {
  return (
    <div className="window">
      <Header />
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
