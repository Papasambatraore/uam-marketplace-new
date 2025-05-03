import emailjs from '@emailjs/browser';

// Configuration EmailJS
const SERVICE_ID = 'service_o4vovdo';
const TEMPLATE_ID = 'template_j7uri9d';
const PUBLIC_KEY = 'fXDHRT30EItp95hVq';

// Initialisation d'EmailJS
emailjs.init(PUBLIC_KEY);

const generateDefaultPassword = () => {
  const adjectives = ['Bleu', 'Rouge', 'Vert', 'Jaune', 'Grand', 'Petit', 'Rapide', 'Lent'];
  const nouns = ['Chien', 'Chat', 'Lion', 'Tigre', 'Oiseau', 'Poisson', 'Lapin', 'Cheval'];
  const numbers = Math.floor(100 + Math.random() * 900);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${numbers}`;
};

// Fonction pour générer un mot de passe sécurisé
const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  // Assurer au moins un caractère de chaque type
  password += charset.match(/[A-Z]/)[0]; // Majuscule
  password += charset.match(/[a-z]/)[0]; // Minuscule
  password += charset.match(/[0-9]/)[0]; // Chiffre
  password += charset.match(/[!@#$%^&*]/)[0]; // Caractère spécial
  
  // Compléter avec des caractères aléatoires
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Fonction pour générer plusieurs mots de passe par défaut
export const generateDefaultPasswords = (count = 5) => {
  const passwords = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generateSecurePassword());
  }
  return passwords;
};

// Fonction pour valider la force d'un mot de passe
export const validatePasswordStrength = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const isLongEnough = password.length >= 8;

  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough,
    strength: {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough
    }
  };
};

export const sendPasswordResetEmail = async (email, name, surname, code) => {
  try {
    console.log('Initialisation EmailJS avec la clé publique:', PUBLIC_KEY);
    console.log('Tentative d\'envoi d\'email avec les paramètres:', {
      email,
      name,
      surname,
      code,
      serviceId: SERVICE_ID,
      templateId: TEMPLATE_ID
    });

    const templateParams = {
      to_email: email,
      to_name: `${surname} ${name}`,
      reset_code: code,
      from_name: 'Keur Diourgui'
    };

    console.log('Paramètres du template:', templateParams);
    
    // Vérification de l'initialisation
    if (!emailjs) {
      throw new Error('EmailJS n\'est pas initialisé correctement');
    }

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Réponse EmailJS:', response);

    if (response.status === 200) {
    return { success: true, message: 'Email envoyé avec succès' };
    } else {
      console.error('Erreur de statut:', response.status);
      throw new Error(`Erreur lors de l'envoi de l'email. Statut: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', error);
    return { 
      success: false, 
      message: `Erreur lors de l'envoi de l'email: ${error.message}` 
    };
  }
}; 