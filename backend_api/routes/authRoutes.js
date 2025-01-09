const express = require('express');

const { login, logout, inscription, getUtilisateur, verifieToken, verifieRefreshToken, CreateSuperAdmin } = require('../controllers/AuthController');

const router = express.Router();


router.post('/login', login);
router.post('/logout', logout);

router.post('/inscription', inscription);

router.get('/utilisateur', verifieToken, getUtilisateur);

router.post('/refresh-token', verifieRefreshToken);

router.post('/utilisateur/create-admin', CreateSuperAdmin);

module.exports = router;