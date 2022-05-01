import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import { DefaultLayout } from './layouts/default-layout';

// Pages
import { Home } from './pages/home';
import { About } from './pages/about';
import { Users } from './pages/users';

import './styles/photon.min.css';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
