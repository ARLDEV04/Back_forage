const express = require('express');
const router = express.Router();

//Import du controller
const authController = require('../controllers/authController');

//Importer le middleware d'authentification
const {authenticateUser} = require('../middlewares/authMiddleware');

//Implementation des routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify', authenticateUser, authController.verify);

module.exports = router;