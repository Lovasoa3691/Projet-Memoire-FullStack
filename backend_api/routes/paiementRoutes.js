const express = require('express')
const { verifieToken } = require('../controllers/AuthController');
const { CreerPaiement, getAllPaiement, getDistictPaiement } = require('../controllers/PaiementController');

const router = express.Router();

router.get('/paiements', verifieToken, getAllPaiement);

router.get('/paiements/distinct', verifieToken, getDistictPaiement);

router.post('/paiements/save', CreerPaiement);

// router.delete('/salles/delete/:idSalle', supprimerSalle);

// router.put('/salles/update/:idSalle', modifierSalle);


module.exports = router;