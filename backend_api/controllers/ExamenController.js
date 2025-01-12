const examen = require('../models/examen');
const etudiant = require('../models/etudiant');
const Utilisateurs = require('../models/utilisateurs');
const inscription = require('../models/inscription');
const examenCounter = require('../models/examenCounter');
const utilisateurs = require('../models/utilisateurs');

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

        const examId = examens.map(id => id.idExam);

        const inscriptionAssocie = await inscription.find({ idExam: { $in: examId } });

        const examensAvecDates = examens.map(exam => {
            const examStart = new Date(exam.dateExam);
            const [heureDebutHeure, heureDebutMinute] = exam.heureDebut.split(':');
            const [heureFinHeure, heureFinMinute] = exam.heureFin.split(':');


            examStart.setHours(heureDebutHeure, heureDebutMinute);


            const examEnd = new Date(examStart);
            examEnd.setHours(heureFinHeure, heureFinMinute);

            exam.examStart = examStart;
            exam.examEnd = examEnd;

            return exam;
        });

        const examenTries = examensAvecDates.sort((a, b) => a.examStart - b.examStart);

        return res.json({ etu, examenTries, inscriptionAssocie });
    } catch (error) {
        return res.json({ erreur: "Erreur lors de la recuperation.", error });
    }

}





async function getExamEnCoursCount(req, res) {

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


        const examens = await examen.find({ statut: 'En cours' });
        if (!examens) {
            return res.json({
                error: "Aucun information trouve"
            });
        }


        return res.json({ examCount: examens.length });
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

async function getNextSequenceValueExamen(seq) {
    const counter = await examenCounter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}

async function getAllExamens(req, res) {
    const { email } = req.user;

    try {
        const utilisateur = await utilisateurs.findOne({ email });

        if (!utilisateur) {
            return res.json({
                erreur: "Utilisateur non trouve"
            });
        }

        const examens = await examen.find({ adminId: utilisateur.id_ut }).sort({ dateExam: -1 });
        if (!examens) {
            return res.json({
                error: "Aucun information trouve"
            });
        }

        return res.json({
            examens
        });

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
}


async function CreerExamen(req, res) {

    try {
        const { codeExam, dateExam, heureDebut, heureFin, matiere, duree, classe, salleExam } = req.body;

        if (!codeExam || !dateExam || !heureDebut || !heureFin || !matiere || !duree || !classe || !salleExam) {
            return res.json({
                succes: false,
                message: "Informations manquantes"
            })
        }

        const { email } = req.user;

        if (!email) {
            return res.json(
                {
                    succes: false,
                    message: "Utilisateur non trouve"
                }
            )
        }

        const utilisateur = await utilisateurs.findOne({ email });

        if (!utilisateur) {
            return res.json(
                {
                    succes: false,
                    message: "Utilisateur non trouve"
                }
            )
        }

        const idAdmin = utilisateur.id_ut;

        const hDeb = new Date(`2000-01-01T${heureDebut}:00Z`);
        const hFin = new Date(`2000-01-01T${heureFin}:00Z`);

        const verifieConflit = await examen.findOne({
            salleExam,
            dateExam,
            $or: [
                {
                    $and: [
                        { heureDebut: { $lte: heureFin } },
                        { heureFin: { $gte: heureDebut } }
                    ]
                }
            ]
        });

        if (verifieConflit) {
            return res.json({
                succes: false,
                message: "Chevauchement detecte: Un autre examen existe deja sur cette plage d'horaire"
            })
        }

        const seqNumber = await getNextSequenceValueExamen('examId');
        const idExam = `EX_${seqNumber.toString().padStart(2, '00')}`;

        const newExam = new examen({
            idExam,
            codeExam,
            dateExam,
            heureDebut,
            heureFin,
            matiere,
            classe,
            salleExam,
            duree,
            adminId: idAdmin,
        })

        await newExam.save();

        return res.json({
            succes: true,
            message: "Examen ajoute avec succes"
        });

    } catch (error) {
        console.log(error.message)
        return res.json({
            message: "Erreur du serveur"
        });
    }
}


async function supprimeExamen(req, res) {

    try {
        const { idExam } = req.params;

        if (!idExam) {
            return res.json({
                message: "Examen non trouve"
            })
        }

        const examenCible = await examen.findOneAndDelete({ idExam: idExam });
        const inscriptionCible = await inscription.findOneAndDelete({ idExam: idExam });

        if (!examenCible || !inscriptionCible) {
            return res.json({
                message: "Examen non trouve"
            })
        }

        return res.json({
            succes: true,
            message: "Examen supprime avec succes"
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            succes: false,
            message: "Erreur lors de la suppression d'examen"
        })
    }
}


module.exports = {
    getExamen,
    getAllExamens,
    mettreAjourStatutExam,
    getExamEnCoursCount,
    CreerExamen,
    supprimeExamen
};

