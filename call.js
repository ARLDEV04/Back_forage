const saveHourlyData = require('./services/hourlySave');
const saveRegularState = require('./services/minuteSave');
const checkMonthlySave = require('./services/monthlySave');

function callServices() {
  // Sauvegarde chaque minute
  setInterval(saveRegularState, 60 * 1000);

  // Alignement au début de l’heure
  const now = new Date();
  const millisUntilNextHour =
    (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

  console.log(
    `Prochaine sauvegarde horaire dans ${Math.floor(millisUntilNextHour / 1000)} secondes`
  );

  // Démarrage aligné
  setTimeout(() => {
    // Lancer la première sauvegarde tout de suite
    saveHourlyData();
    checkMonthlySave();

    // Lancer la tâche répétée toutes les heures pile
    setInterval(() => {
      saveHourlyData();
      checkMonthlySave();
    }, 60 * 60 * 1000);
  }, millisUntilNextHour);

  console.log('Sauvegarde régulière (chaque minute) démarrée');
}

module.exports = callServices;
