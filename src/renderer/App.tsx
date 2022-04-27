import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { BclTitle } from './components/bcl-title';
import './css/photon.min.css';
import { Footer } from './layouts/footer';

const Hello = () => {
  return (
    <div className="window">
      <header className="toolbar toolbar-header">
        <h1 className="title">Header</h1>
      </header>
      <div className="window-content">
        <div className="pane-group">
          <div className="pane-sm sidebar">...</div>
          <div className="pane">...</div>
        </div>
      </div>
      <Footer>
        <BclTitle>Developed with ❤️ by Brixi!</BclTitle>
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
