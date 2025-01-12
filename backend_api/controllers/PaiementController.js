const examen = require('../models/examen');
const paiement = require('../models/paiement');
const etudiant = require('../models/etudiant');
const paiementCounter = require('../models/paiementCounter');

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

async function getNextSequenceValuePaiement(seq) {
    const counter = await paiementCounter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}

async function getDistictPaiement(req, res) {
    const paiements = await paiement.distinct('descriptionPaie', { etudiantId: 'E1151' })

    return res.json({
        paiements
    })
}

async function getAllPaiement(req, res) {
    const paiements = await paiement.find({ etudiantId: 'E1151' })

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

    const newPaiement = new paiement({
        idPaie: idPaie,
        typePaie: 'Frais de formation',
        etudiantId: etudiantId,
        descriptionPaie: descriptionPaie,
        montant: montant,
        modePaie: 'Espece',
        statutPaie: statutPaie,
        datePaie: new Date()
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
    verifierPaiement
}