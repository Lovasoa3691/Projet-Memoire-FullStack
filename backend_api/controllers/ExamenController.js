const examen = require('../models/examen');
const etudiant = require('../models/etudiant');
const Utilisateurs = require('../models/utilisateurs');

async function getExamen(req, res) {

    const { email } = req.user;

    try {

        const utilisateur = await Utilisateurs.findOne({ email: email });

        if (!utilisateur) {
            return res.json({
                erreur: "Utilisateur non trouve"
            });
        }

        const etu = await etudiant.findOne({ utilisateur: utilisateur._id });
        if (!etu) {
            return res.json({
                erreur: "Etudiant non trouve"
            });
        }

        const classe = new RegExp(`${etu.mention} ${etu.niveau}`, 'i');

        const examens = await examen.find({ classe: classe, statut: 'En cours' });
        if (!examens) {
            return res.json({
                error: "Aucun information trouve"
            });
        }

        return res.json({ etu, examens });
    } catch (error) {
        return res.json({ erreur: "Erreur lors de la recuperation." });
    }

}

module.exports = { getExamen };

