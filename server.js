require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const donneesRegulieres = require('./models/dataRegularModel');
const callServices = require('./call');

global.volumeHeure = 0;
global.volumeMensuel = 0;
global.volumeTotal = 0;
global.moisActuel = null;

const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB()
  .then(async () => {
    // Restauration de l'état depuis MongoDB
    const lastState = await donneesRegulieres.findOne().sort({ updatedAt: -1 });

    if (lastState) {
      global.volumeHeure = lastState.volumeHeure;
      global.volumeMensuel = lastState.volumeMensuel;
      global.volumeTotal = lastState.volumeTotal;
      global.moisActuel = lastState.moisActuel;
      console.log('État restauré depuis MongoDB');
    } else {
      global.moisActuel = getMoisActuel();
      console.log('Aucun état précédent trouvé, démarrage avec valeurs initiales');
    }

    // Lancer serveur + socket
    const server = http.createServer(app);
    const io = initSocket(server);

    server.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      callServices();
    });
  })
  .catch((err) => {
    console.error('Impossible de se connecter à MongoDB: ', err);
  });

function getMoisActuel() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
