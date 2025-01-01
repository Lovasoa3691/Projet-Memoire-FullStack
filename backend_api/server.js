const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const salleRoute = require('./routes/SalleRoutes');
const etuRoute = require('./routes/etudiantRoute');
const smsRoute = require('./routes/smsRoute');
const authRoutes = require('./routes/authRoutes')
const examRoutes = require('./routes/examRoutes');

const app = express();
const PORT = 5000;


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

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

app.listen(PORT, () => {
    console.log('Serveur en cours sur le port: ', PORT);
});