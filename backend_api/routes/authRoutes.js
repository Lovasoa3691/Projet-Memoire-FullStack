const express = require('express');

const { login, logout, inscription, getUtilisateur, verifieToken } = require('../controllers/AuthController');

const router = express.Router();


router.post('/login', login);
router.post('/logout', logout);

router.post('/inscription', inscription);

router.get('/utilisateur', verifieToken, getUtilisateur);

module.exports = router;