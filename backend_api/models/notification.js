const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    idNot: { type: String },
    titre: { type: String },
    objet: { type: String },
    dateEnvoi: { type: Date },
    statutNot: { type: String }
});

const notification = mongoose.model('notifications', NotificationSchema);

module.exports = notification;