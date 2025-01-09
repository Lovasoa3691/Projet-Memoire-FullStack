const inscription = require('../models/inscription');
const paiement = require('../models/paiement');
const examen = require('../models/examen');
const etudiant = require('../models/etudiant');
const Utilisateurs = require('../models/utilisateurs');
const notification = require('../models/notification');
const notificationEtu = require('../models/notificationEtudiant');
const Counter = require('../models/counter');
const historique = require('../models/historique');
const { getNextSequenceValueHisto } = require('./historiqueController');

async function CreerInscription(req, res) {
    try {

        console.log('Donnees recus: ', req.body);
        const { etudiantId, idExamen, dateExam } = req.body;

        if (!etudiantId || !idExamen || !dateExam) {
            return res.json({
                erreur: "Informations manquantes."
            });
        }

        const dateExamen = new Date(dateExam);
        const moisExam = dateExamen.getMonth();
        const anneeExam = dateExamen.getFullYear();


        // Recuperation des paiements de l'etudiant pour tout les mois de l'examen
        const paiemnts = await paiement.find({
            etudiantId: etudiantId,
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

        const paiementsManquantes = moisrequis.filter(m => !moisPayes.includes(m));


        const seqNumber = await getNextSequenceValue('notificationId');
        const idNot = `NOT_${seqNumber.toString().padStart(2, '0')}`;

        const inscriptionExistant = await inscription.findOne({
            idExam: idExamen,
        });

        if (inscriptionExistant) {
            return res.json({
                message: "Desole! Vous etes deja inscrit a cet examen."
            })
        }

        const exmInfo = await examen.findOne({ idExam: idExamen });

        const incrip = new inscription({
            etudiantMatricule: etudiantId,
            idExam: idExamen,
            statutIns: 'Valide'
        });

        await incrip.save();

        const newNotification = new notification({
            idNot: idNot,
            titre: `Inscription a la session d'examen ${exmInfo.codeExam}`,
            objet: `Votre inscription a l'examen ${exmInfo.matiere} 
            de la session ${exmInfo.codeExam} 
            qui debutera le ${exmInfo.dateExam} est valide.`,
            dateEnvoi: new Date()
        })

        await newNotification.save();

        const newNotificationEtudiant = new notificationEtu({
            etuMatricule: etudiantId,
            idNot: idNot,
            dateRecept: new Date()
        });

        await newNotificationEtudiant.save();

        // if (paiementsManquantes.length > 0) {
        //     return res.json({
        //         erreur: "Paiements incomplets",
        //         paiementsManquantes
        //     })
        // }

        const sqHistoNum = await getNextSequenceValueHisto('histoId');
        const idHisto = `H_${sqHistoNum.toString().padStart(2, '0')}`;

        const newhistorique = new historique({
            etuMatricule: etudiantId,
            dateHisto: new Date(),
            idHisto: idHisto,
            motifHisto: `Inscription a l'examen "${exmInfo.matiere}" de la session "${exmInfo.codeExam}"`,
            statutHisto: "Valide"
        });

        await newhistorique.save();

        return res.json({
            succes: "Inscription reussie"
        });

    } catch (error) {
        console.log(error)
        res.json({
            message: 'Erreur de server'
        });

    }
}

async function getNextSequenceValue(seq) {
    const counter = await Counter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}

async function getInscriptionValideCount(req, res) {
    try {
        const { email } = req.user;

        const utilisateur = await Utilisateurs.findOne({ email: email });
        if (!utilisateur) {
            return res.json({ erreur: "Utilisateur non trouvé" });
        }

        const etu = await etudiant.findOne({ utilisateur: utilisateur._id });
        if (!etu) {
            return res.json({ erreur: "Étudiant non trouvé" });
        }

        const matriculeEtu = etu.matricule;

        const inscriptionsValide1 = await inscription.find({
            etudiantMatricule: matriculeEtu,
            statutIns: 'Valide',
        });

        if (inscriptionsValide1.length === 0) {
            return res.json({
                message: "Aucune inscription valide trouvée"
            });
        }

        const examIds = inscriptionsValide1.map(insc => insc.idExam);

        const InscriptionValide2 = await examen.find({
            idExam: { $in: examIds },
            statut: 'En cours'
        });

        const examEnCoursCount = await examen.find({
            statut: 'En cours'
        });

        return res.json({
            succes: true,
            examEnCoursCount: examEnCoursCount.length,
            nbInscriptionValide: InscriptionValide2.length,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erreur lors de la récupération des données",
            error: error.message
        });
    }
}


async function getInscriptionParEtudiant(req, res) {
    try {
        const { email } = req.user;

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

        const matriculeEtu = etu.matricule;

        const inscriptions = await inscription.find({ etudiantMatricule: matriculeEtu });

        if (inscriptions.length === 0) {
            return res.json({
                message: "Aucun inscription trouve"
            })
        }

        const idExamens = inscriptions.map(inscription => inscription.idExam);

        const examens = await examen.find({ idExam: { $in: idExamens } });

        const resultats = examens.map(exam => {
            const inscriptionAssocie = inscriptions.find(ins => ins.idExam === exam.idExam);
            return {
                mon_examen: exam,
                mon_inscription: inscriptionAssocie
            };
        });

        return res.json(resultats);

    } catch (error) {
        console.log(error);
        return res.json({
            message: "Erreur lors de la recuperation de l'inscription"
        });
    }
}

async function getInscriptionEnCoursParEtudiant(req, res) {
    try {
        const { email } = req.user;

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

        const matriculeEtu = etu.matricule;

        const inscriptions = await inscription.find({ etudiantMatricule: matriculeEtu });

        if (inscriptions.length === 0) {
            return res.json({
                message: "Aucun inscription trouve"
            })
        }

        const idExamens = inscriptions.map(inscription => inscription.idExam);

        const examens = await examen.find({ idExam: { $in: idExamens }, statut: 'En cours' }).limit(5);

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

        return res.json({ examenTries });

        // const resultats = examens.map(exam => {
        //     const inscriptionAssocie = inscriptions.find(ins => ins.idExam === exam.idExam);
        //     return {
        //         mon_examen: exam,
        //         mon_inscription: inscriptionAssocie
        //     };
        // });

        // return res.json(resultats);

    } catch (error) {
        console.log(error);
        return res.json({
            message: "Erreur lors de la recuperation de l'inscription"
        });
    }
}

async function supprimerInscription(req, res) {
    try {
        const { idInscription } = req.params;
        // console.log(idInscription);

        if (!idInscription) {
            return res.json({
                message: "Identifiant de l'inscription manquant"
            })
        }

        const inscriptionSupprime = await inscription.findByIdAndDelete(idInscription);

        if (!inscriptionSupprime) {
            return res.json({
                message: "Inscription non trouve"
            });
        }

        return res.json({
            succes: "Inscription supprime avec succes.", inscription: inscriptionSupprime
        });
    } catch (error) {
        return res.json({
            message: "Erreur lors de la suppression de l'inscription"
        });
    }
}

module.exports = {
    CreerInscription,
    getInscriptionEnCoursParEtudiant,
    getInscriptionParEtudiant,
    supprimerInscription,
    getInscriptionValideCount
};