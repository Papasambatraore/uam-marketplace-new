import React, { useState } from 'react';
import { generateDefaultPasswords } from '../services/emailService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John', surname: 'Doe', email: 'john@example.com', defaultPassword: 'BleuChien123' },
    { id: 2, name: 'Jane', surname: 'Smith', email: 'jane@example.com', defaultPassword: 'RougeChat456' },
    // Ajoutez plus d'utilisateurs ici
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Samba' && password === 'Sambatraore2002') {
      setIsAuthenticated(true);
    } else {
      alert('Identifiants incorrects');
    }
  };

  const generateNewPasswords = () => {
    const newPasswords = generateDefaultPasswords();
    setPasswords(newPasswords);
  };

  const resetUserPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      generateNewPasswords();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Connexion Administrateur</h2>
          <div className="form-group">
            <label>Nom d'utilisateur:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Se connecter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panneau d'Administration</h1>
        <button 
          className="logout-btn"
          onClick={() => setIsAuthenticated(false)}
        >
          Déconnexion
        </button>
      </div>
      
      <div className="admin-section">
        <h2>Gestion des Utilisateurs</h2>
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <p><strong>Nom:</strong> {user.surname} {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mot de passe par défaut:</strong> {user.defaultPassword}</p>
              </div>
              <button 
                className="reset-password-btn"
                onClick={() => resetUserPassword(user.id)}
              >
                Générer un nouveau mot de passe
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="admin-section">
          <h2>Nouveaux mots de passe générés pour {selectedUser.surname} {selectedUser.name}</h2>
          <div className="passwords-list">
            {passwords.map((password, index) => (
              <div key={index} className="password-item">
                <span className="password-number">{index + 1}.</span>
                <span className="password-value">{password}</span>
              </div>
            ))}
          </div>
          <button 
            className="generate-btn"
            onClick={generateNewPasswords}
          >
            Générer de nouveaux mots de passe
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 