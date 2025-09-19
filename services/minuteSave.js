// services/minuteSave.js
const DataRegular = require('../models/dataRegularModel');

async function saveRegularState() {
  try {
    if (global.volumeHeure > 0 || global.volumeMensuel > 0 || global.volumeTotal > 0) {
      await DataRegular.findOneAndUpdate(
        {}, 
        {
          volumeHeure: global.volumeHeure,
          volumeMensuel: global.volumeMensuel,
          volumeTotal: global.volumeTotal,
          moisActuel: global.moisActuel
        },
        { upsert: true, new: true }
      );

      console.log(`[${new Date().toISOString()}] État régulier sauvegardé`);
    } else {
      console.log(`[${new Date().toISOString()}] Rien à sauvegarder (débit nul)`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Erreur sauvegarde régulière :`, err.message);
  }
}

module.exports = saveRegularState;
