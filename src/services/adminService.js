import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminService = {
  // Obtenir les statistiques
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
    }
  },

  // Gérer les utilisateurs
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des utilisateurs' };
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const response = await axios.put(`${API_URL}/admin/users/${userId}/status`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la modification du statut utilisateur' };
    }
  },

  // Gérer les annonces
  getAds: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/ads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des annonces' };
    }
  },

  updateAdStatus: async (adId, status) => {
    try {
      const response = await axios.put(`${API_URL}/admin/ads/${adId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la modification du statut de l\'annonce' };
    }
  }
};

export default adminService; 