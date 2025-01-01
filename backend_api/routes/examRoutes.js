const express = require('express');

const { getExamen } = require('../controllers/ExamenController');
const { authentificate } = require('../controllers/AuthController')
const { CreerInscription, getInscriptionParEtudiant, supprimerInscription } = require('../controllers/InscriptionController')

const router = express.Router();

router.get('/examens', authentificate, getExamen);
router.post('/inscrire', CreerInscription);
router.get('/inscriptions', authentificate, getInscriptionParEtudiant);
router.delete('/inscription/:id', supprimerInscription);

// router.post('/inscription', inscription);

// router.get('/utilisateur', getUtilisateur);

module.exports = router;