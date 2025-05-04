const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Middleware pour vérifier si l'utilisateur est admin
router.use(auth, adminAuth);

// Obtenir les statistiques
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeAds = await Ad.countDocuments({ status: 'active' });
    const pendingAds = await Ad.countDocuments({ status: 'pending' });
    const totalRevenue = await Ad.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalUsers,
      activeAds,
      pendingAds,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Gérer les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json({ message: 'Statut utilisateur mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Gérer les annonces
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find()
      .populate('author', 'name surname email')
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/ads/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }

    ad.status = status;
    await ad.save();

    res.json({ message: 'Statut de l\'annonce mis à jour', ad });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 