const express = require('express');

const { getExamen, mettreAjourStatutExam } = require('../controllers/ExamenController');
const { authentificate, verifieToken } = require('../controllers/AuthController')
const { CreerInscription, getInscriptionParEtudiant, supprimerInscription } = require('../controllers/InscriptionController')

const router = express.Router();

// router.use(verifieToken);

router.get('/examens', verifieToken, getExamen);
router.get('/updateExamStatus', mettreAjourStatutExam);
router.post('/inscrire', CreerInscription);
router.get('/inscriptions', verifieToken, getInscriptionParEtudiant);
router.delete('/inscription/:id', supprimerInscription);

// router.post('/inscription', inscription);

// router.get('/utilisateur', getUtilisateur);

module.exports = router;