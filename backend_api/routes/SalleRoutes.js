const express = require('express');
const salle = require('../models/salle');

const router = express.Router();

router.get('/salles', async (req, res) => {
    try {
        const salles = await salle.find();
        res.json(salles);
    } catch (error) {
        res.json({ message: 'Erreur lors de la recuperation des donnees', error });
    }
});

module.exports = router;