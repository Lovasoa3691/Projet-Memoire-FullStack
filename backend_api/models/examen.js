const mongoose = require('mongoose');

const ExamenSchema = new mongoose.Schema({
    idExam: { type: String, required: true, unique: true },
    codeExam: { type: String, required: true },
    dateExam: { type: String, required: true },
    heureDebut: { type: String, required: true },
    heureFin: { type: String, required: true },
    matiere: { type: String, required: true },
    duree: { type: String, required: true },
    statut: { type: String, required: true, default: "En cours" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateurs' },
}, { timestamps: true });

const examen = mongoose.model('examens', ExamenSchema);


module.exports = examen;