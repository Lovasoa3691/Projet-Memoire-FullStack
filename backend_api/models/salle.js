
const mongoose = require('mongoose');

const SalleSchema = new mongoose.Schema({
    idSalle: { type: Number },
    numSalle: { type: String },
    capacite: { type: Number },
    localisation: { type: String }
});


const salle = mongoose.model('salle', SalleSchema);


module.exports = salle;