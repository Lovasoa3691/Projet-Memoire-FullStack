const mongoose = require('mongoose');

const NotificationAdminSchema = new mongoose.Schema({
    idAdmin: { type: String },
    dateRecept: { type: Date },
    heureRecept: { type: String },
});

const notificationAdmin = mongoose.model('notificationAdmins', NotificationAdminSchema);

module.exports = notificationAdmin;