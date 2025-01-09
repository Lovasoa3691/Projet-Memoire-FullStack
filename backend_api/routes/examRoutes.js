const express = require('express');

const { getExamen, mettreAjourStatutExam, getExamEnCoursCount } = require('../controllers/ExamenController');
const { authentificate, verifieToken } = require('../controllers/AuthController')
const { CreerInscription, getInscriptionParEtudiant, supprimerInscription, getInscriptionEnCoursParEtudiant, getInscriptionValideCount } = require('../controllers/InscriptionController')

const router = express.Router();

// router.use(verifieToken);

router.get('/examens', verifieToken, getExamen);
router.get('/examen/count', verifieToken, getInscriptionValideCount);
router.get('/prochaineExam', verifieToken, getInscriptionEnCoursParEtudiant);
router.get('/updateExamStatus', mettreAjourStatutExam);
// router.get('/inscriptions/count', verifieToken, getInscriptionValideCount);
router.post('/inscrire', CreerInscription);
router.get('/inscriptions', verifieToken, getInscriptionParEtudiant);
router.delete('/inscription/:idInscription', supprimerInscription);

// router.post('/inscription', inscription);

// router.get('/utilisateur', getUtilisateur);

module.exports = router;