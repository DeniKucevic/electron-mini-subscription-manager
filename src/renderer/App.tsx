import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './layouts/default-layout';
import { Home } from './pages/home';
import { About } from './pages/about';

import './styles/photon.min.css';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
