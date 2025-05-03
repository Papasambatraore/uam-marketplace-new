import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import './App.css';
// ... autres imports ...

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/admin" className="nav-link">Administration</Link>
        </nav>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={
            <div className="home-page">
              <h1>Bienvenue sur le Marketplace UAM</h1>
              <p>Pour accéder au panneau d'administration, cliquez sur le lien ci-dessus ou accédez à <a href="/admin">/admin</a></p>
            </div>
          } />
          {/* ... autres routes ... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 