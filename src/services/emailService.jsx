import emailjs from '@emailjs/browser';

// Configuration d'EmailJS
const EMAILJS_PUBLIC_KEY = 'fXDHRT30EItp95hVq';
const EMAILJS_SERVICE_ID = 'service_o4vovdo';
const EMAILJS_TEMPLATE_ID = 'template_j7uri9d';

// Fonction pour générer un mot de passe sécurisé
export const generateSecurePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Fonction pour générer des mots de passe par défaut
export const generateDefaultPasswords = (count) => {
  const passwords = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generateSecurePassword());
  }
  return passwords;
};

// Fonction pour envoyer l'email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (email, name, surname, newPassword) => {
  try {
    const templateParams = {
      to_email: email,
      to_name: `${name} ${surname}`,
      new_password: newPassword
    };

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return {
      success: true,
      message: 'Email envoyé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: error.message
    };
  }
}; 