import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { BclTitle } from './components/bcl-title';
import { Footer } from './layouts/footer';
import { Header } from './layouts/header';

import './styles/photon.min.css';

const Hello = () => {
  return <div className="window">HELLO PAGE</div>;
};

export default function App() {
  return (
    <div>
      <Header>
        <BclTitle>This is a Header</BclTitle>
      </Header>
      <div className="window">
        <div className="window-content">
          <div className="pane-group">
            <nav className="pane-sm sidebar">...</nav>
            <main className="pane">
              <Router>
                <Routes>
                  <Route path="/" element={<Hello />} />
                </Routes>
              </Router>
            </main>
          </div>
        </div>
      </div>
      <Footer>
        <BclTitle>Developed with ❤️ by Brixi & JonnXor!</BclTitle>
      </Footer>
    </div>
  );
}
