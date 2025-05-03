import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
// ... autres imports ...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        {/* ... autres routes ... */}
      </Routes>
    </Router>
  );
}

export default App; 