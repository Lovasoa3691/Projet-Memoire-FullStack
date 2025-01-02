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

async function mettreAjourStatutExam(req, res) {
    try {
        const now = new Date();

        const exams = await examen.find({ dateExam: { $gte: new Date().setHours(0, 0, 0, 0) } });

        const AJour = await Promise.all(
            exams.map(async (exam) => {
                const examStart = new Date(exam.dateExam);
                examStart.setHours(exam.heureDebut.split(':')[0], exam.heureFin.split(':')[1]);

                const examEnd = new Date(exam.dateExam);
                examEnd.setHours(exam.heureDebut.split(':')[0], exam.heureFin.split(':')[1]);

                if (now > examEnd) {
                    return await examen.findByIdAndUpdate(
                        exam._id,
                        { statut: 'Termine' },
                        { new: true }
                    );
                }
                return exam;
            })
        );

        res.json({
            succes: true,
            examMiseAJour: AJour
        });
    } catch (error) {
        res.json({
            succes: false,
            erreur: error.message
        });
    }
}

module.exports = { getExamen, mettreAjourStatutExam };

