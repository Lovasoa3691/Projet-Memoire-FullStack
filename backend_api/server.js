const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const salleRoute = require('./routes/SalleRoutes');
const etuRoute = require('./routes/etudiantRoute');
const smsRoute = require('./routes/smsRoute');
const authRoutes = require('./routes/authRoutes')
const examRoutes = require('./routes/examRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = 5000;


app.use(express.json());
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Spécifiez votre origine front-end
    credentials: true, // Permet l'envoi des cookies
}));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/systeme_inscription', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connexion reussie!'))
    .catch(err => console.error('Erreur de connexion a MongoDB :', err));


app.use('/api', salleRoute);
app.use('/api', etuRoute);
app.use('/api', smsRoute);
app.use('/api', authRoutes);
app.use('/api', examRoutes);
app.use('/api', notificationRoutes);

app.listen(PORT, () => {
    console.log('Serveur en cours sur le port: ', PORT);
});