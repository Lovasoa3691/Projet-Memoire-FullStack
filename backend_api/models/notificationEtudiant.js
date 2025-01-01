const mongoose = require('mongoose');

const NotificationEtuSchema = new mongoose.Schema({
    etuMatricule: { type: String },
    dateRecept: { type: Date },
    heureRecept: { type: String },
});

const notificationEtu = mongoose.model('notificationEtudiants', NotificationEtuSchema);

module.exports = notificationEtu;