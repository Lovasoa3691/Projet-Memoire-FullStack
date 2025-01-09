const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Utilisateurs = require('../models/utilisateurs');
const etudiant = require('../models/etudiant');
const administration = require('../models/administration');
const utilisateurs = require('../models/utilisateurs');
const adminCounter = require('../models/adminCounter');

const secretKey = process.env.SECRET_KEY || "mySecretKey3691";
const refreshKey = process.env.REFRESH_SECRET_KEY || "mySecretKey3691_refresh";

async function login(req, res) {
    const { email, mdp } = req.body;

    try {

        const utilisateur = await Utilisateurs.findOne({ email });
        if (!utilisateur) {
            return res.json({ message: 'Utilisateur non trouvé' });
        }

        const mdpValide = await bcrypt.compare(mdp, utilisateur.mdp);
        if (!mdpValide) {
            return res.json({ message: 'Mot de passe incorrect' });
        }

        // const etudiants = await etudiant.findOne({ utilisateur: utilisateur._id });

        const token = jwt.sign(
            {
                id: utilisateur._id,
                nomUt: utilisateur.nom_ut,
                email: utilisateur.email,
                role: utilisateur.role,
            },
            secretKey,
            { expiresIn: '1h' }
        );

        const refreshtoken = jwt.sign(
            {
                id: utilisateur._id,
                nomUt: utilisateur.nom_ut,
                email: utilisateur.email,
                role: utilisateur.role,
            },
            refreshKey,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            succes: 'Authentification reussie',
            token,
            utilisateur: {
                id_ut: utilisateur.id_ut,
                nom_ut: utilisateur.nom_ut,
                email: utilisateur.email,
                role: utilisateur.role,
            },
            // etudiant: etudiants ? {
            //     matricule: etudiants.matricule,
            //     mention: etudiants.mention,
            //     niveau: etudiants.niveau,
            // } : null
        });
    } catch (error) {
        // console.error(error);
        return res.json({ message: 'Erreur lors de la connexion' });
    }
}

async function logout(req, res) {
    res.clearCookie('token', { hhtpPnly: true, secure: true });
    res.json({
        message: "Deconnexion reussie"
    });
}

async function inscription(req, res) {
    const { nom, prenom, nomUt, email, mdp } = req.body;
    try {

        const etudiantsExistant = await etudiant.findOne({
            nomEtu: nom,
            prenomEtu: prenom
        });

        if (!etudiantsExistant) {
            return res.json({
                message: "Etudiant n'est pas elligible dans le systeme."
            });
        }


        const utilisateurExistant = await Utilisateurs.findOne({ email });
        if (utilisateurExistant) {
            return res.json({
                message: "Un compte utilisateur avec cet email existe déjà."
            });
        }

        const hashedPassword = await bcrypt.hash(mdp, 10);
        const newUser = new Utilisateurs({
            id_ut: `${etudiantsExistant.matricule}`,
            nom_ut: nomUt,
            email,
            mdp: hashedPassword,
            role: 'Etudiant',
            statut_ut: "Active"
        });

        await newUser.save();

        etudiantsExistant.utilisateur = newUser._id;
        await etudiantsExistant.save();

        return res.json({
            message: "sucess"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
}

async function verifieToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.json({
            message: "Acces interdit: aucun token fourni"
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.json({
            message: "Token invalide ou expire"
        });
    }
}


async function verifieRefreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Non autorisé' });
    }

    jwt.verify(refreshToken, refreshKey, (err, utilisateur) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });

        const newAccessToken = jwt.sign(
            {
                id: utilisateur._id,
                nomUt: utilisateur.nom_ut,
                email: utilisateur.email,
                role: utilisateur.role,
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        res.json({ message: 'Token rafraîchi avec succès' });
    });
}

async function getUtilisateur(req, res) {
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.json({
    //         message: "Token manquant ou invalide"
    //     });
    // }

    // const token = authHeader.split(' ')[1];

    try {
        // const decoded = jwt.verify(token, secretKey);

        const utilisateur = await Utilisateurs.findById(req.user.id);
        if (!utilisateur) {
            return res.json({
                message: "Utilisateur non trouve"
            });
        }
        // req.user = decoded;
        // next();

        return res.json({
            message: "Success",
            utilisateur: {
                id_ut: utilisateur.id_ut,
                nom_ut: utilisateur.nom_ut,
                email: utilisateur.email,
                role: utilisateur.role,
            },

        });
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return res.json({ message: "Token invalide ou expiré." });
    }
}


async function authentificate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.json({
            message: "Token manquant ou invalide"
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.json({
            message: "Token invalide"
        });
    }
}

async function getNextSequenceValueAdmin(seq) {
    const counter = await adminCounter.findByIdAndUpdate(
        { _id: seq },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );

    return counter.sequence_value
}

async function CreateSuperAdmin(req, res) {
    const sqAdminValue = await getNextSequenceValueAdmin('adminId');
    const idAdmin = `ADMIN_${sqAdminValue.toString().padStart(2, '0')}`;

    const newAdmin = new administration({
        idAdmin: idAdmin,
        nomAdmin: "Orion",
        prenomAdmin: "Scotty"
    });

    await newAdmin.save();

    const mdp = 'admin3691'
    const hashedPassword = await bcrypt.hash(mdp, 10);


    const infoUtilisateur = new utilisateurs({
        id_ut: newAdmin.idAdmin,
        nom_ut: `${newAdmin.prenomAdmin} ${newAdmin.nomAdmin}`,
        email: 'orionscotty@gmail.com',
        mdp: hashedPassword,
        role: 'Admin',
        statut_ut: 'Active'
    });

    await infoUtilisateur.save();

    return res.json({
        message: 'Super admin ajoute'
    });
}

module.exports = {
    login,
    logout,
    inscription,
    getUtilisateur,
    authentificate,
    verifieToken,
    verifieRefreshToken,
    CreateSuperAdmin,
    getNextSequenceValueAdmin
};
