import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import adminService from '../services/adminService';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAds: 0,
    pendingAds: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Vérifier si l'utilisateur est admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.isAdmin) {
          enqueueSnackbar('Accès non autorisé', { variant: 'error' });
          navigate('/');
          return;
        }

        setIsAuthenticated(true);
        await loadData();
      } catch (error) {
        enqueueSnackbar('Erreur de chargement', { variant: 'error' });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, enqueueSnackbar]);

  const loadData = async () => {
    try {
      const [statsData, usersData, adsData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getAds()
      ]);

      setStats(statsData);
      setUsers(usersData);
      setAds(adsData);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      await loadData();
      enqueueSnackbar('Statut utilisateur mis à jour', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleUpdateAdStatus = async (adId, status) => {
    try {
      await adminService.updateAdStatus(adId, status);
      await loadData();
      enqueueSnackbar('Statut de l\'annonce mis à jour', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panneau d'Administration</h1>
        <button 
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
        >
          Déconnexion
        </button>
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
          <p className="stat-value">{stats.totalRevenue} FCFA</p>
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
              <div key={user._id} className="user-card">
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
                    onClick={() => handleToggleUserStatus(user._id)}
                  >
                    {user.status === 'active' ? 'Désactiver' : 'Activer'}
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
              <div key={ad._id} className="ad-card">
                <div className="ad-info">
                  <h3>{ad.title}</h3>
                  <p><strong>Utilisateur:</strong> {ad.author?.name} {ad.author?.surname}</p>
                  <p><strong>Prix:</strong> {ad.price} FCFA</p>
                  <p><strong>Date:</strong> {new Date(ad.createdAt).toLocaleDateString()}</p>
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
                        onClick={() => handleUpdateAdStatus(ad._id, 'active')}
                      >
                        Approuver
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleUpdateAdStatus(ad._id, 'rejected')}
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  {ad.status === 'active' && (
                    <button 
                      className="deactivate-btn"
                      onClick={() => handleUpdateAdStatus(ad._id, 'inactive')}
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
    </div>
  );
};

export default AdminPanel; 