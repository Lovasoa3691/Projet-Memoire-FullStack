const express = require('express');

const { login, logout, inscription, getUtilisateur, verifieToken, verifieRefreshToken } = require('../controllers/AuthController');

const router = express.Router();


router.post('/login', login);
router.post('/logout', logout);

router.post('/inscription', inscription);

router.get('/utilisateur', verifieToken, getUtilisateur);

router.post('/refresh-token', verifieRefreshToken);

module.exports = router;