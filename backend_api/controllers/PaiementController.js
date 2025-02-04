const examen = require('../models/examen');
const paiement = require('../models/paiement');
const etudiant = require('../models/etudiant');
const paiementCounter = require('../models/paiementCounter');
const annee = require('../models/anneeUniversitaire');
const inscription = require('../models/inscription');
const moment = require('moment')


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


async function verifierPaiementEtudiant(req, res) {
    try {
        const anneeActive = await annee.findOne({ statutAnnee: 'Active' });
        if (!anneeActive) {
            return res.status(404).json({ error: "Aucune année active trouvée" });
        }

        const examens = await examen.find({ statut: 'En cours', idAnnee: anneeActive.idAnnee });
        if (!examens.length) {
            return res.json({ error: "Aucun examen trouvé" });
        }

        const examIdList = examens.map(exam => exam.idExam);
        const inscriptions = await inscription.find({ idExam: { $in: examIdList }, statutIns: 'En attente' });

        if (!inscriptions.length) {
            return res.json({ message: "Aucune inscription en attente" });
        }

        const result = [];
        const today = moment().startOf('day');

        for (const insc of inscriptions) {
            const exam = examens.find(e => e.idExam === insc.idExam);
            if (!exam) continue;

            // Déterminer les frais attendus
            const fraisAttendus = ["S1", "S3", "S5", "S7"].includes(exam.codeExam)
                ? ["FF1", "FF2", "FF3", "FF4"]
                : ["FF5", "FF6", "FF7", "FF8"];

            // Utiliser distinct() pour récupérer les frais payés par l'étudiant
            const descriptionsPaiement = await paiement.distinct("descriptionPaie", { etudiantId: insc.etudiantMatricule });

            if (descriptionsPaiement.length > 0) {
                // Vérifier si tous les frais attendus sont couverts
                const fraisCouverts = fraisAttendus.every(frais => descriptionsPaiement.includes(frais));

                if (fraisCouverts) {
                    // Vérifier si l'examen est dans 3 jours ou moins
                    result.push({ etudiant: insc.etudiantMatricule, statut: "Accepté" });
                } else {
                    const dateExam = moment(exam.dateExam, 'YYYY-MM-DD');
                    const diffJours = dateExam.diff(today, 'days');

                    if (diffJours <= 3) {
                        await inscription.findOneAndUpdate({ etudiantMatricule: insc.etudiantMatricule }, { statutIns: 'Rejeté' });
                        // result.push({
                        //     etudiant: insc.etudiantMatricule,
                        //     statut: "Rejeté",
                        //     raison: `L'examen est dans ${diffJours} jour(s), inscription annulée malgré le paiement complet`
                        // });

                        result.push({
                            etudiant: insc.etudiantMatricule,
                            statut: "Rejeté",
                            raison: "Frais de formation non entièrement couverts"
                        });

                        // Envoyer une notification (ajouter ici la logique d'envoi)
                        console.log(`Notification envoyée à l'étudiant ${insc.etudiantMatricule} pour rejet d'inscription`);

                    } else {
                        // Inscription acceptée car frais couverts ET examen pas trop proche
                        result.push({ etudiant: insc.etudiantMatricule, statut: "Accepté" });
                    }

                }
            } else {
                result.push({ etudiant: insc.etudiantMatricule, statut: "Rejeté", raison: "Aucun paiement trouvé" });
            }
        }

        return res.json(result);
    } catch (error) {
        console.error("Erreur lors de la vérification des paiements :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}


// async function verifierPaiementEtudiant(req, res) {
//     try {
//         const anneeActive = await annee.findOne({ statutAnnee: 'Active' });
//         if (!anneeActive) {
//             return res.status(404).json({ error: "Aucune année active trouvée" });
//         }

//         const examens = await examen.find({ statut: 'En cours', idAnnee: anneeActive.idAnnee });
//         if (!examens.length) {
//             return res.json({ error: "Aucun examen trouvé" });
//         }

//         const examIdList = examens.map(exam => exam.idExam);
//         const inscriptions = await inscription.find({ idExam: { $in: examIdList }, statutIns: 'En attente' });

//         if (!inscriptions.length) {
//             return res.json({ message: "Aucune inscription en attente" });
//         }

//         const result = [];

//         for (const insc of inscriptions) {
//             const exam = examens.find(e => e.idExam === insc.idExam);
//             if (!exam) continue;

//             // Déterminer les frais attendus
//             const fraisAttendus = ["S1", "S3", "S5", "S7"].includes(exam.codeExam)
//                 ? ["FF1", "FF2", "FF3", "FF4"]
//                 : ["FF5", "FF6", "FF7", "FF8"];

//             // Utiliser distinct() pour récupérer les frais payés par l'étudiant
//             const descriptionsPaiement = await paiement.distinct("descriptionPaie", { etudiantId: insc.etudiantMatricule });

//             if (descriptionsPaiement.length > 0) {
//                 // Vérifier si tous les frais attendus sont couverts
//                 const fraisCouverts = fraisAttendus.every(frais => descriptionsPaiement.includes(frais));

//                 if (fraisCouverts) {
//                     result.push({ etudiant: insc.etudiantMatricule, statut: "Accepté" });
//                 } else {
//                     result.push({
//                         etudiant: insc.etudiantMatricule,
//                         statut: "Rejeté",
//                         raison: "Frais de formation non entièrement couverts"
//                     });
//                 }
//             } else {
//                 result.push({ etudiant: insc.etudiantMatricule, statut: "Rejeté", raison: "Aucun paiement trouvé" });
//             }
//         }

//         // for (const insc of inscriptions) {
//         //     const exam = examens.find(e => e.idExam === insc.idExam);
//         //     if (!exam) continue;

//         //     // Déterminer les frais attendus
//         //     const fraisAttendus = ["S1", "S3", "S5", "S7"].includes(exam.codeExam)
//         //         ? ["FF1", "FF2", "FF3", "FF4"]
//         //         : ["FF5", "FF6", "FF7", "FF8"];

//         //     // Récupérer tous les paiements de l'étudiant et extraire distinctement les descriptions
//         //     const paiementsEtudiant = await paiement.find({ etudiantId: insc.etudiantMatricule });

//         //     if (paiementsEtudiant.length > 0) {
//         //         const descriptionsPaiement = [...new Set(paiementsEtudiant.flatMap(p => p.descriptionPaie))];

//         //         // Vérifier si tous les frais attendus sont couverts
//         //         const fraisCouverts = fraisAttendus.every(frais => descriptionsPaiement.includes(frais));

//         //         if (fraisCouverts) {
//         //             result.push({ etudiant: insc.etudiantMatricule, statut: "Accepté" });
//         //         } else {
//         //             // await inscription.updateOne({ _id: insc._id }, { statutIns: 'Rejeté' });
//         //             result.push({
//         //                 etudiant: insc.etudiantMatricule,
//         //                 statut: "Rejeté",
//         //                 raison: "Frais de formation non entièrement couverts"
//         //             });
//         //         }
//         //     } else {
//         //         // await inscription.updateOne({ _id: insc._id }, { statutIns: 'Rejeté' });
//         //         result.push({ etudiant: insc.etudiantMatricule, statut: "Rejeté", raison: "Aucun paiement trouvé" });
//         //     }
//         // }

//         return res.json(result);
//     } catch (error) {
//         console.error("Erreur lors de la vérification des paiements :", error);
//         return res.status(500).json({ error: "Erreur serveur" });
//     }
// }



// async function verifierPaiementEtudiant(req, res) {

//     const anneeActive = await annee.findOne({ statutAnnee: 'Active' })

//     const examens = await examen.find({ statut: 'En cours', idAnnee: anneeActive.idAnnee });
//     if (!examens) {
//         return res.json({
//             error: "Aucun information trouve"
//         });
//     }

//     const examId = examens.map(id => id.idExam);

//     const inscriptionList = await inscription.find({ idExam: { $in: examId }, statutIns: 'En attente' });

//     return res.json(inscriptionList)
// }

async function getNextSequenceValuePaiement(seq) {
    const counter = await paiementCounter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}

async function getDistictPaiement(req, res) {

    // const descriptionsPaie = await paiement.distinct('descriptionPaie', { etudiantId: paieEtu.etudiantId })

    const anneeActive = await annee.findOne({ statutAnnee: 'Active' })

    const paiemntsEtu = await paiement.find({ idAnnee: anneeActive.idAnnee })

    const paiements = await paiement.distinct('descriptionPaie', { etudiantId: 'E1151', idAnnee: anneeActive.idAnnee })


    return res.json({ paiements })

    // const result = {}

    // for (const paieEtu of paiemntsEtu){
    //     const descriptionsPaie = await paiement.distinct('descriptionPaie', { etudiantId: paieEtu.etudiantId })

    //     result[paieEtu.etudiantId] = descriptionsPaie
    // }

    // return res.json(result)
}

async function getAllPaiement(req, res) {

    const anneeActive = await annee.findOne({ statutAnnee: 'Active' })

    const paiements = await paiement.find({ idAnnee: anneeActive.idAnnee })

    return res.json({
        paiements
    })
}

async function CreerPaiement(req, res) {
    const { etudiantId, descriptionPaie, montant, } = req.body;

    const etudniantsCible = await etudiant.findOne({ matricule: etudiantId });
    const niveauEtu = etudniantsCible.niveau;
    let FFMontant = 0;

    switch (niveauEtu) {
        case "L1": FFMontant = 50000
            break;
        case "L2": FFMontant = 70000
            break;
        case "L3": FFMontant = 80000
            break;
        case "M1": FFMontant = 100000
            break;
        default: FFMontant = 130000
            break;
    }

    const montantPaye = FFMontant * descriptionPaie.length;

    const statutPaie = montant < montantPaye ? "En cours" : "Complet";


    const sqNumber = await getNextSequenceValuePaiement("paiementId");
    const idPaie = `P_${sqNumber.toString().padStart(2, '0')}`;

    const anneeActive = await annee.findOne({ statutAnnee: 'Active' })

    const newPaiement = new paiement({
        idPaie: idPaie,
        typePaie: 'Frais de formation',
        etudiantId: etudiantId,
        descriptionPaie: descriptionPaie,
        montant: montant,
        modePaie: 'Espece',
        statutPaie: statutPaie,
        datePaie: new Date(),
        idAnnee: anneeActive.idAnnee
    })

    await newPaiement.save();

    return res.json({
        message: "Paiement a ete faite"
    })
}


module.exports = {
    getDistictPaiement,
    getAllPaiement,
    CreerPaiement,
    verifierPaiement,
    verifierPaiementEtudiant
}