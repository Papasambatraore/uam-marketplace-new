const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour l'envoi d'email de bienvenue
app.post('/api/send-welcome-email', async (req, res) => {
  const { name, email } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bienvenue sur UAM Marketplace',
      html: `
        <h1>Bienvenue ${name} !</h1>
        <p>Merci de vous être inscrit sur UAM Marketplace.</p>
        <p>Vous pouvez maintenant commencer à publier des annonces et à interagir avec la communauté.</p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>L'équipe UAM Marketplace</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email de bienvenue envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Route pour l'envoi d'email de vérification
app.post('/api/send-verification-email', async (req, res) => {
  const { name, email, token } = req.body;

  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Vérification de votre email - UAM Marketplace',
      html: `
        <h1>Bonjour ${name} !</h1>
        <p>Merci de vous être inscrit sur UAM Marketplace.</p>
        <p>Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 5px;">
          Vérifier mon email
        </a>
        <p>Si vous n'avez pas créé de compte sur UAM Marketplace, vous pouvez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe UAM Marketplace</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email de vérification envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Route pour l'envoi d'email de récupération de mot de passe
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  console.log('Tentative d\'envoi d\'email à:', to);

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1976d2;">${subject}</h2>
        <div style="margin: 20px 0;">
          ${text.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #666; font-size: 12px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>`
    };

    console.log('Options d\'email:', mailOptions);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.response);
    
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    });
  }
});

// Route pour l'envoi du code de réinitialisation
app.post('/api/send-reset-code', async (req, res) => {
  const { email, code, name, surname } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Code de réinitialisation de mot de passe - UAM Marketplace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Bonjour ${surname} ${name},</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur UAM Marketplace.</p>
          <p>Votre code de réinitialisation est :</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1976d2; margin: 0;">${code}</h1>
          </div>
          <p>Ce code est valable pendant 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe UAM Marketplace</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
}); 