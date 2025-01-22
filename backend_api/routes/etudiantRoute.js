const express = require('express');
const etudiant = require('../models/etudiant');
const { AjouterEtudiant, supprimerEtudiant, mettreAjourEtudiant, getAllEtudiant, getEtudiantCount } = require('../controllers/EtudiantController');
const { verifieToken } = require('../controllers/AuthController');

const router = express.Router();

router.post('/etudiants/save', AjouterEtudiant);

router.delete('/etudiants/delete/:matricule', supprimerEtudiant);

router.put('/etudiants/update/:matricule', mettreAjourEtudiant);

router.get('/etudiants', verifieToken, getAllEtudiant);

router.get('/etudiants/count-by-mention', getEtudiantCount);

router.get('/etudiants/count', async (req, res) => {
    try {
        const countEtu = await etudiant.countDocuments();
        res.json(countEtu);
    } catch (error) {
        res.json({ message: 'Erreur lors de la recuperation des donnees', error });
    }
})

module.exports = router;