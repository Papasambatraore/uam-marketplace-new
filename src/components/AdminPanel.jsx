import React, { useState, useEffect } from 'react';
import { generateDefaultPasswords, sendPasswordResetEmail } from '../services/emailService';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAds: 0,
    pendingAds: 0,
    totalRevenue: 0
  });
  const [passwordGenerationCount, setPasswordGenerationCount] = useState(5);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedUserForChange, setSelectedUserForChange] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [users, setUsers] = useState([
    { id: 1, name: 'John', surname: 'Doe', email: 'john@example.com', defaultPassword: 'BleuChien123', status: 'active' },
    { id: 2, name: 'Jane', surname: 'Smith', email: 'jane@example.com', defaultPassword: 'RougeChat456', status: 'inactive' },
  ]);

  const [ads, setAds] = useState([
    { id: 1, title: 'Annonce 1', status: 'active', user: 'John Doe', date: '2024-03-01' },
    { id: 2, title: 'Annonce 2', status: 'pending', user: 'Jane Smith', date: '2024-03-02' },
  ]);

  useEffect(() => {
    // Simuler le chargement des statistiques
    setStats({
      totalUsers: users.length,
      activeAds: ads.filter(ad => ad.status === 'active').length,
      pendingAds: ads.filter(ad => ad.status === 'pending').length,
      totalRevenue: 1500
    });
  }, [users, ads]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Samba' && password === 'Sambatraore2002') {
      setIsAuthenticated(true);
      addNotification('Connexion réussie', 'success');
    } else {
      addNotification('Identifiants incorrects', 'error');
    }
  };

  const addNotification = (message, type) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const generateNewPasswords = () => {
    const newPasswords = generateDefaultPasswords(passwordGenerationCount);
    setPasswords(newPasswords);
    addNotification(`${passwordGenerationCount} nouveaux mots de passe générés`, 'success');
  };

  const handlePasswordCountChange = (e) => {
    const count = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
    setPasswordGenerationCount(count);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addNotification('Mot de passe copié dans le presse-papier', 'success');
  };

  const resetUserPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      generateNewPasswords();
      addNotification(`Mot de passe réinitialisé pour ${user.name}`, 'info');
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    addNotification('Statut utilisateur modifié', 'info');
  };

  const handleAdAction = (adId, action) => {
    setAds(ads.map(ad => 
      ad.id === adId 
        ? { ...ad, status: action }
        : ad
    ));
    addNotification(`Annonce ${action}`, 'success');
  };

  const handlePasswordReset = (user) => {
    setSelectedUserForReset(user);
    const newPassword = generateSecurePassword();
    setResetPassword(newPassword);
    setShowResetPassword(true);
    addNotification(`Mot de passe généré pour ${user.name} ${user.surname}`, 'success');
  };

  const sendResetPassword = async () => {
    if (!selectedUserForReset) return;

    try {
      const result = await sendPasswordResetEmail(
        selectedUserForReset.email,
        selectedUserForReset.name,
        selectedUserForReset.surname,
        resetPassword
      );

      if (result.success) {
        addNotification('Email de réinitialisation envoyé avec succès', 'success');
        setShowResetPassword(false);
        setSelectedUserForReset(null);
      } else {
        addNotification(`Erreur lors de l'envoi de l'email: ${result.message}`, 'error');
      }
    } catch (error) {
      addNotification('Erreur lors de l\'envoi de l\'email', 'error');
    }
  };

  const handleChangePassword = (user) => {
    setSelectedUserForChange(user);
    setShowChangePassword(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordChangeSubmit = async () => {
    if (newPassword !== confirmPassword) {
      addNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (newPassword.length < 8) {
      addNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
      return;
    }

    try {
      const result = await sendPasswordResetEmail(
        selectedUserForChange.email,
        selectedUserForChange.name,
        selectedUserForChange.surname,
        newPassword
      );

      if (result.success) {
        addNotification('Mot de passe changé avec succès', 'success');
        setShowChangePassword(false);
        setSelectedUserForChange(null);
      } else {
        addNotification(`Erreur lors du changement de mot de passe: ${result.message}`, 'error');
      }
    } catch (error) {
      addNotification('Erreur lors du changement de mot de passe', 'error');
    }
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
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

      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
            <span className="notification-time">{notification.timestamp}</span>
          </div>
        ))}
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Utilisateurs</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Annonces Actives</h3>
          <p className="stat-value">{stats.activeAds}</p>
        </div>
        <div className="stat-card">
          <h3>Annonces en Attente</h3>
          <p className="stat-value">{stats.pendingAds}</p>
        </div>
        <div className="stat-card">
          <h3>Revenu Total</h3>
          <p className="stat-value">{stats.totalRevenue}€</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
          onClick={() => setActiveTab('ads')}
        >
          Annonces
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Gestion des Utilisateurs</h2>
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <p><strong>Nom:</strong> {user.surname} {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Statut:</strong> 
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                </div>
                <div className="user-actions">
                  <button 
                    className={`status-btn ${user.status}`}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Désactiver' : 'Activer'}
                  </button>
                  <button 
                    className="reset-password-btn"
                    onClick={() => handlePasswordReset(user)}
                  >
                    Réinitialiser le mot de passe
                  </button>
                  <button 
                    className="change-password-btn"
                    onClick={() => handleChangePassword(user)}
                  >
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="admin-section">
          <h2>Gestion des Annonces</h2>
          <div className="ads-list">
            {ads.map(ad => (
              <div key={ad.id} className="ad-card">
                <div className="ad-info">
                  <h3>{ad.title}</h3>
                  <p><strong>Utilisateur:</strong> {ad.user}</p>
                  <p><strong>Date:</strong> {ad.date}</p>
                  <p><strong>Statut:</strong> 
                    <span className={`status-badge ${ad.status}`}>
                      {ad.status === 'active' ? 'Active' : ad.status === 'pending' ? 'En attente' : 'Rejetée'}
                    </span>
                  </p>
                </div>
                <div className="ad-actions">
                  {ad.status === 'pending' && (
                    <>
                      <button 
                        className="approve-btn"
                        onClick={() => handleAdAction(ad.id, 'active')}
                      >
                        Approuver
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleAdAction(ad.id, 'rejected')}
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  {ad.status === 'active' && (
                    <button 
                      className="deactivate-btn"
                      onClick={() => handleAdAction(ad.id, 'inactive')}
                    >
                      Désactiver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showResetPassword && (
        <div className="modal-overlay">
          <div className="password-reset-modal">
            <h3>Réinitialisation du mot de passe</h3>
            <p>Un nouveau mot de passe a été généré pour {selectedUserForReset.name} {selectedUserForReset.surname}</p>
            <div className="password-display">
              <input 
                type="text" 
                value={resetPassword} 
                readOnly 
                className="password-input"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="send-email-btn"
                onClick={sendResetPassword}
              >
                Envoyer par email
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowResetPassword(false);
                  setSelectedUserForReset(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="modal-overlay">
          <div className="password-reset-modal">
            <h3>Changement de mot de passe</h3>
            <p>Changer le mot de passe pour {selectedUserForChange.name} {selectedUserForChange.surname}</p>
            <div className="password-form">
              <div className="form-group">
                <label>Nouveau mot de passe:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="send-email-btn"
                onClick={handlePasswordChangeSubmit}
              >
                Changer le mot de passe
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowChangePassword(false);
                  setSelectedUserForChange(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 