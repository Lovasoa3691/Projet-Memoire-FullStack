const express = require('express');
const etudiant = require('../models/etudiant');

const router = express.Router();

router.get('/etudiants', async (req, res) => {
    try {
        const etudiants = await etudiant.find();
        res.json(etudiants);
    } catch (error) {
        res.json({ message: 'Erreur lors de la recuperation des donnees', error });
    }
});

router.get('/etudiants/count', async (req, res) => {
    try {
        const countEtu = await etudiant.countDocuments();
        res.json(countEtu);
    } catch (error) {
        res.json({ message: 'Erreur lors de la recuperation des donnees', error });
    }
})

module.exports = router;