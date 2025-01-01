const mongoose = require('mongoose');

const AdministrationSchema = new mongoose.Schema({
    nomAdmin: { type: String },
    prenomAdmin: { type: Date },
});

const administration = mongoose.model('administrations', AdministrationSchema);

module.exports = administration;