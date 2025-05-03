import { generateDefaultPasswords } from '../services/emailService.js';

const passwords = generateDefaultPasswords();
console.log('Mots de passe générés :');
passwords.forEach((password, index) => {
  console.log(`${index + 1}. ${password}`);
}); 