const express = require('express');

const { login, inscription, getUtilisateur } = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', login);

router.post('/inscription', inscription);

router.get('/utilisateur', getUtilisateur);

module.exports = router;