import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import { DefaultLayout } from './layouts/default-layout';

// Pages
import { Home } from './pages/home';
import { About } from './pages/about';
import { Users } from './pages/users';
import { DeactiveUsers } from './pages/deactive-users';

import { SubscriptionModel } from './pages/subscription-models';
import { ConfirmationDialogProvider } from './context/confirmation-dialog';

import './styles/photon.min.css';

export const App = () => {
  return (
    <ConfirmationDialogProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="users" element={<Users />} />
            <Route path="deactive-users" element={<DeactiveUsers />} />
            <Route path="subscription-model" element={<SubscriptionModel />} />
          </Route>
        </Routes>
      </Router>
    </ConfirmationDialogProvider>
  );
};

export default App;
