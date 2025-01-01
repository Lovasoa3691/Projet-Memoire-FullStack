const examen = require('../models/examen');
const paiement = require('../models/paiement');

async function verifierPaiement(req, res) {
    try {
        const { etuId, examId } = req.body;

        if (!etuId || !examId) {
            return res.json({
                erreur: "Etudiant et examsn sont requis"
            });
        }

        const exam = await examen.findOne({ idExam: examId });

        if (!exam) {
            return res.json({
                erreur: "Examen non trouve"
            });
        }

        const dateExam = new Date(exam.dateExam);
        const moisExam = dateExam.getMonth();
        const anneeExam = dateExam.getFullYear();


        // Recuperation des paiements de l'etudiant pour tout les mois de l'examen
        const paiemnts = await paiement.find({
            etudiantId: etuId,
            $or: [
                { annee: { $lt: anneeExam } },
                { annee: anneeExam, mois: { $lte: moisExam + 1 } },
            ]
        });

        // Veifiction des mois payes
        const moisPayes = paiemnts.map(p => `${p.mois}-${p.annee}`);
        const moisrequis = [];
        for (let i = moisExam; i >= 0; i--) {
            moisrequis.push(`${new Date(anneeExam, i).toLocaleString('fr', { month: 'long' })}-${anneeExam}`);
        }

        const paiementsManquantes = moisrequis.filter(m => !moisPayes.incluides(m));

        if (paiementsManquantes.length > 0) {
            return res.json({
                erreur: "Paiements incomplets",
                paiementsManquantes
            })
        }

        re.json({
            succes: "Paiement satisfait"
        })
    } catch (error) {
        res.json({
            message: 'Erreur de server'
        });

    }
}