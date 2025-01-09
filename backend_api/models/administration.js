const mongoose = require('mongoose');

const AdministrationSchema = new mongoose.Schema({
    idAdmin: { type: String, reuired: true },
    nomAdmin: { type: String, reuqired: true },
    prenomAdmin: { type: String, required: true },
});

const administration = mongoose.model('administrations', AdministrationSchema);

module.exports = administration;