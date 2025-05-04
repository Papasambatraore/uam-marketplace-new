const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
  }
  next();
};

module.exports = adminAuth; 