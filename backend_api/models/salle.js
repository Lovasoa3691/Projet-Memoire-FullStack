
const mongoose = require('mongoose');

const SalleSchema = new mongoose.Schema({
    ID: { type: Number },
    NUM_SALLE: { type: String },
    CAPACITE: { type: Number },
    LOCALISATION: { type: String }
});


const salle = mongoose.model('salle', SalleSchema);


module.exports = salle;