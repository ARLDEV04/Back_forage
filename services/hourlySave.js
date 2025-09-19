// services/hourlySave.js
const DonneesParHeure = require('../models/dataHourModel');

async function saveHourlyData() {
  const now = new Date();
  const debitMoyen = global.volumeHeure / 60;

  try {
    const heureData = new DonneesParHeure({
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()),
      debitMoyen,
      volumeHeure: global.volumeHeure,
      volumeCumule: global.volumeTotal,
    });

    await heureData.save();

    console.log(`[${now.toISOString()}]  Données horaires sauvegardées`);

    // Reset volume de l'heure
    global.volumeHeure = 0;
  } catch (err) {
    console.error(`[${now.toISOString()}]  Erreur enregistrement horaire :`, err.message);
  }
}

module.exports = saveHourlyData;
