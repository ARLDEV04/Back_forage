// services/monthlySave.js
const DonneesParMois = require('../models/dataMonthModel');

function getMoisActuel() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function checkMonthlySave() {
  const moisCourant = getMoisActuel();

  if (global.moisActuel && global.moisActuel !== moisCourant) {
    try {
      await DonneesParMois.create({
        mois: global.moisActuel,
        volumeTotalMois: global.volumeMensuel
      });

      console.log(`[${new Date().toISOString()}] Mois ${global.moisActuel} sauvegardé`);

      // Reset volume mensuel
      global.volumeMensuel = 0;
      global.moisActuel = moisCourant;
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Erreur enregistrement mensuel :`, err.message);
    }
  } else {
    // Cas initial ou aucun changement
    global.moisActuel = moisCourant;
  }
}

module.exports = checkMonthlySave;
