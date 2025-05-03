// Liste des administrateurs (à remplacer par une vraie base de données en production)
const ADMIN_USERS = [
  {
    email: 'admin@uam.sn',
    password: 'admin123',
    name: 'Admin',
    surname: 'UAM',
    isAdmin: true
  }
];

// Fonction pour vérifier si l'utilisateur est admin
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.isAdmin === true;
};

// Fonction pour se connecter
export const login = async (email, password) => {
  try {
    // Vérifier si c'est un admin
    const adminUser = ADMIN_USERS.find(user => user.email === email && user.password === password);
    if (adminUser) {
      const userData = { ...adminUser };
      delete userData.password; // Ne pas stocker le mot de passe
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      return userData;
    }

    // Vérifier dans les utilisateurs normaux
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const userData = { ...user };
    delete userData.password; // Ne pas stocker le mot de passe
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    return userData;
  } catch (error) {
    throw error;
  }
};

// Fonction pour se déconnecter
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
}; 