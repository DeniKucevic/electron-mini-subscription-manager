import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { BclTitle } from './components/bcl-title';
import { Footer } from './layouts/footer';
import { Header } from './layouts/header';

import './styles/photon.min.css';

const Hello = () => {
  return (
    <div className="window">
      <Header>
        <BclTitle>This is a Header</BclTitle>
      </Header>
      <div className="window-content">
        <div className="pane-group">
          <div className="pane-sm sidebar">...</div>
          <div className="pane">...</div>
        </div>
      </div>
      <Footer>
        <BclTitle>Developed with ❤️ by Brixi & JonnXor!</BclTitle>
      </Footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
