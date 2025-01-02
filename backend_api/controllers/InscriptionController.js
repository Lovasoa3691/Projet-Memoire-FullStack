const inscription = require('../models/inscription');
const paiement = require('../models/paiement');
const examen = require('../models/examen');
const etudiant = require('../models/etudiant');
const Utilisateurs = require('../models/utilisateurs');
const notification = require('../models/notification');
const notificationEtu = require('../models/notificationEtudiant');
const Counter = require('../models/counter');

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

        const newNotification = new notification({
            idNot: idNot,
            titre: "Inscription a l'examen ...",
            objet: "Votre inscription a l'examen ... du ... est valide.",
            dateEnvoi: new Date()
        })

        await newNotification.save();

        const newNotificationEtudiant = new notificationEtu({
            etuMatricule: etudiantId,
            idNot: idNot,
            dateRecept: new Date()
        });

        await newNotificationEtudiant.save();

        if (paiementsManquantes.length > 0) {
            return res.json({
                erreur: "Paiements incomplets",
                paiementsManquantes
            })
        }

        // const incrip = new inscription({
        //     etudiantMatricule: etudiantId,
        //     idExam: idExamen,
        //     statutIns: 'Valide'
        // });

        // await incrip.save();

        re.json({
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

async function supprimerInscription(req, res) {
    try {
        const { idInsc } = req.params;

        if (!idInsc) {
            return res.json({
                message: "Identifiant de l'inscription manquant"
            })
        }

        const inscriptionSupprime = await inscription.findByIdAndDelete(idInsc);

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

module.exports = { CreerInscription, getInscriptionParEtudiant, supprimerInscription };