import emailjs from '@emailjs/browser';

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export const sendPasswordResetEmail = async (email) => {
  try {
    // Générer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Envoyer l'email
    const templateParams = {
      to_email: email,
      temp_password: tempPassword,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    // Mettre à jour le mot de passe dans le localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.email === email) {
        return { ...user, password: tempPassword };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, message: 'Erreur lors de l\'envoi de l\'email' };
  }
}; 