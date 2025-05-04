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

// Mots de passe maîtres (master passwords)
const MASTER_PASSWORDS = [
  'UAM@2024#Master',
  'KeurDiourgui#2024',
  'MasterAccess@UAM24'
];

// Fonction pour vérifier si l'utilisateur est admin
export const isAdmin = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.isAdmin === true;
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return false;
  }
};

// Fonction pour se connecter
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    // Vérifier si c'est un mot de passe maître
    if (MASTER_PASSWORDS.includes(password)) {
      // Chercher l'utilisateur par email
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (user) {
        const userData = { ...user };
        delete userData.password;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        return userData;
      }
    }

    // Vérifier si c'est un admin
    const adminUser = ADMIN_USERS.find(user => user.email === email && user.password === password);
    if (adminUser) {
      const userData = { ...adminUser };
      delete userData.password;
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
    delete userData.password;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    return userData;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

// Fonction pour se déconnecter
export const logout = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    // Rediriger vers la page d'accueil après la déconnexion
    window.location.href = '/';
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return isLoggedIn && Object.keys(user).length > 0;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return {};
  }
}; 