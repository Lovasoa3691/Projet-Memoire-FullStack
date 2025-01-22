const examen = require('../models/examen');
const etudiant = require('../models/etudiant');
const Utilisateurs = require('../models/utilisateurs');
const inscription = require('../models/inscription');
const examenCounter = require('../models/examenCounter');
const utilisateurs = require('../models/utilisateurs');
const notification = require('../models/notification');
const notificationEtu = require('../models/notificationEtudiant');
const nodemailer = require('nodemailer');
const counter = require('../models/counter');

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

async function getAllExamEnCoursCount(req, res) {

    const { email } = req.user;

    try {

        const utilisateur = await Utilisateurs.findOne({ email: email });

        if (!utilisateur) {
            return res.json({
                erreur: "Utilisateur non trouve"
            });
        }

        const examens = await examen.find({ adminId: utilisateur.id_ut, statut: 'En cours' });
        if (!examens) {
            return res.json({
                error: "Aucun information trouve"
            });
        }

        const examensTermine = await examen.find({ adminId: utilisateur.id_ut, statut: 'Termine' });
        if (!examensTermine) {
            return res.json({
                error: "Aucun information trouve"
            });
        }

        return res.json({ examCount: examens.length, examTermine: examensTermine.length });
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
                    return await examen.findOneAndUpdate(
                        { idExam: exam.idExam },
                        { statut: 'Termine' }
                    );
                }
                return exam;
            })
        );

        return res.json({
            succes: true,
            examMiseAJour: AJour
        });
    } catch (error) {
        return res.json({
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

async function getNextSequenceValue(seq) {
    const Counters = await counter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return Counters.sequence_value
}


async function CreerExamen(req, res) {

    try {
        const { email } = req.user;
        const { codeExam, dateExam, heureDebut, heureFin, matiere, duree, classe, salleExam } = req.body;

        if (!codeExam || !dateExam || !heureDebut || !heureFin || !matiere || !duree || !classe || !salleExam) {
            return res.json({
                succes: false,
                message: "Informations manquantes"
            })
        }

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
        // const hDeb = new Date(`2000-01-01T${heureDebut}:00Z`);
        // const hFin = new Date(`2000-01-01T${heureFin}:00Z`);

        // const verifieConflit = await examen.findOne({
        //     salleExam,
        //     dateExam,
        //     $or: [
        //         {
        //             $and: [
        //                 { heureDebut: { $lte: heureFin } },
        //                 { heureFin: { $gte: heureDebut } }
        //             ]
        //         }
        //     ]
        // });

        // if (verifieConflit) {
        //     return res.json({
        //         succes: false,
        //         message: "Chevauchement detecte: Un autre examen existe deja sur cette plage d'horaire"
        //     })
        // }

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


        const mentionsNiveaux = classe.map(cls => {
            const [mention, niveau] = cls.split(' ');
            return { mention, niveau };
        })

        const etudiantsList = await Promise.all(
            mentionsNiveaux.map(async ({ mention, niveau }) => {
                return await etudiant.find({ mention, niveau });
            })
        )

        const allEtudiants = etudiantsList.flat();

        const matricules = allEtudiants.map(etudiant => etudiant.matricule);

        const inscriptions = await inscription.find({ etudiantMatricule: { $in: matricules } });

        const matriculesInscrites = inscriptions.map(incs => incs.etudiantMatricule);

        const users = await Utilisateurs.find({ id_ut: { $in: matriculesInscrites } });

        const etuMatricule = users.map(user => (user.id_ut));
        const etuMail = users.map(user => (user.email));

        // console.log(etuMatricule)

        // Envoi notification par mail
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: '',
        //         pass: ''
        //     }
        // });

        // for (const email of etuMail){
        //     await transporter.sendMail({
        //         from: '"Institut de Formation Technique" <email>',
        //         to: email,
        //         subject: "Preparez-vous pour les nouvelles sessions d'examen.",
        //         text: `Chers etudiants,\n 
        //             De nouvelles sessions d'examen ont ete ouvertes! 
        //             C'est l'occasion ideale de demontrer vos competences et de valider vos acquis. 
        //             Consultez votre espace etudiant des maintenant pour plus de details.`,
        //     });
        // }

        if (etuMatricule.length === 0) {
            return res.json({
                message: "Etudiant Inconnu"
            })
        }

        // Envoi notification via systeme
        const seqNumberNot = await getNextSequenceValue('notificationId');
        const idNot = `NOT_${seqNumberNot.toString().padStart(2, '0')}`;

        const newNotification = new notification({
            idNot: idNot,
            titre: `Nouvelle session d'examen disponible !`,
            objet: `Chers etudiants,\n
                Une nouvelle examen supplementaire vient d'etre ajoutee.
                Ne manquez pas cette opportuinite ! \n
                Les inscriptions sont ouvertes pour une duree limitee.
                Consultez votre espace << session d'examen disponible >> pour plus de details.`,
            dateEnvoi: new Date()
        });

        await newNotification.save();

        const idNotFinal = newNotification.idNot;

        for (const matriculeEtudiant of etuMatricule) {
            const newNotificationEtu = new notificationEtu({
                etuMatricule: matriculeEtudiant,
                idNot: idNotFinal,
                dateRecept: new Date()
            });
            await newNotificationEtu.save();
        }

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

async function getExamenCount(req, res) {
    try {
        const examCount = await examen.countDocuments();

        return res.json({ examCount });
    } catch (error) {

    }
}


module.exports = {
    getExamen,
    getAllExamens,
    mettreAjourStatutExam,
    getExamEnCoursCount,
    CreerExamen,
    supprimeExamen,
    getExamenCount,
    getAllExamEnCoursCount
};

