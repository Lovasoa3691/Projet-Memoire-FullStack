
const mongoose = require('mongoose');

const NotificationEtuSchema = new mongoose.Schema({
    etuMatricule: { type: String },
    idNot: { type: String },
    dateRecept: { type: Date, default: Date.now },
    statutNot: { type: String, default: "Non lu" }
});

const notificationEtu = mongoose.model('notificationetudiants', NotificationEtuSchema);

module.exports = notificationEtu;