const express = require('express');

const { getAllNotification,
    supprimerNotification,
    updateNotificationStatus,
    getNotificationCount,
    getNotificationRecent
} = require('../controllers/notificationController');
const { verifieToken } = require('../controllers/AuthController')


const router = express.Router();

// router.use(verifieToken);

router.get('/notifications', verifieToken, getAllNotification);
router.put('/notificationEtu/:idNot', updateNotificationStatus);
// router.get('/inscriptions', verifieToken, getInscriptionParEtudiant);
router.delete('/notification/:idNot', supprimerNotification);

// router.post('/inscription', inscription);

router.get('/notification/count', verifieToken, getNotificationCount);
router.get('/notification/recents', verifieToken, getNotificationRecent);

module.exports = router;