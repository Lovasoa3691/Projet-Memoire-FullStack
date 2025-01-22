const etudiant = require("../models/etudiant");
const etudiantCounter = require("../models/etudiantCounter");
const salle = require("../models/salle");
const salleCounter = require("../models/salleCounter");
const utilisateurs = require("../models/utilisateurs");

async function getAllEtudiant(req, res) {
    const { email } = req.user;

    try {
        const admin = await utilisateurs.findOne({ email });

        if (!admin) {
            return res.json({
                succes: false,
                message: "Utilisateur non trouve"
            })
        }

        const etudiants = await etudiant.find();

        return res.json({
            succes: true,
            etudiant: etudiants
        })
    } catch (error) {

    }
}

async function getNextSequenceValueEtudiant(seq) {
    const counter = await etudiantCounter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}


async function AjouterEtudiant(req, res) {
    try {
        const { nomEtu, prenomEtu, adresseEtu, contactEtu, mention, niveau } = req.body;

        if (!nomEtu || !prenomEtu || !adresseEtu || !contactEtu || !mention || !niveau) {
            res.json({
                message: "Informations manquantes"
            })
        }

        const seqNumber = await getNextSequenceValueEtudiant('etudiantId');
        const matricule = `E${seqNumber.toString()}`;

        const nouveauEtudiant = new etudiant({
            matricule: matricule,
            nomEtu: nomEtu,
            prenomEtu: prenomEtu,
            adresseEtu: adresseEtu,
            contactEtu: `(+261)${contactEtu}`,
            mention: mention,
            niveau: niveau
        })

        await nouveauEtudiant.save();

        return res.json({
            succes: true,
            message: "Nouveau ligne a ete ajoute avec succes"
        });
    } catch (error) {
        return res.json({
            succes: false,
            message: "Une erreur est survenue lors d'enregistrement de donnee"
        });
    }


}

async function mettreAjourEtudiant(req, res) {
    try {
        const { matricule } = req.params;
        const { nomEtu, prenomEtu, adresseEtu, contactEtu, mention, niveau } = req.body;

        if (!matricule) {
            return res.json({
                succes: false,
                message: "Identifiant de l'etudiant manquant"
            })
        }

        const etudiantMAJ = await etudiant.findOneAndUpdate(
            { matricule },
            { nomEtu, prenomEtu, adresseEtu, contactEtu: `(+261)${contactEtu}`, mention, niveau }
        );

        if (!etudiantMAJ) {
            return res.json({
                succes: false,
                message: "Etudiant non trouve"
            });
        }

        return res.json({
            succes: true,
            message: "Une ligne a ete modifie avec succes."
        });
    } catch (error) {
        return res.json({
            succes: false,
            message: "Erreur lors de la mise a jour de l'information de l'etudiant",
            erreur: error.message
        });
    }

}


async function supprimerEtudiant(req, res) {
    try {
        const { matricule } = req.params;

        console.log(matricule);

        if (!matricule) {
            return res.json({
                succes: false,
                message: "Identifiant de l'etudiant manquant"
            })
        }

        const etudiantSupprime = await etudiant.findOneAndDelete({ matricule: matricule });

        if (!etudiantSupprime) {
            return res.json({
                succes: false,
                message: "Etudiant non trouve"
            });
        }

        return res.json({
            succes: true,
            message: "Une ligne a ete supprime."
        });
    } catch (error) {
        return res.json({
            succes: false,
            message: "Erreur lors de la suppression de la salle",
            erreur: error.message
        });
    }
}


async function getEtudiantCount(req, res) {
    try {
        const InfoCount = await etudiant.find({
            mention: "INFO"
        })

        const BtpCount = await etudiant.find({
            mention: "BTP"
        })

        const DroitCount = await etudiant.find({
            mention: "DROIT"
        })

        const GmCount = await etudiant.find({
            mention: "GM"
        })

        const IcjCount = await etudiant.find({
            mention: "ICJ"
        })

        return res.json({
            Info: InfoCount.length,
            Btp: BtpCount.length,
            Droit: DroitCount.length,
            Gm: GmCount.length,
            Icj: IcjCount.length
        });

    } catch (error) {

    }
}

module.exports = {
    getAllEtudiant,
    AjouterEtudiant,
    mettreAjourEtudiant,
    supprimerEtudiant,
    getEtudiantCount
}