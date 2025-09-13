const donneesHeure = require('../models/dataHourModel');
const donneesMois = require('../models/dataMonthModel');
const donneesRegulieres = require('../models/dataRegularModel');

function getMoisActuel() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Controller de post
exports.postDebit = async (req, res) => {
    const { debit } = req.body;

    if (typeof debit !== 'number' || isNaN(debit)) {
      return res.status(400).json({ error: 'Le débit doit être un nombre valide' });
    }

    const now = new Date();
    const moisCourant = getMoisActuel();

    // Volume en temps réel
    const realVolume = debit / 60;

    // Mise à jour des compteurs
    global.volumeHeure += realVolume;
    global.volumeMensuel += realVolume;
    global.volumeTotal += realVolume;
    global.compteurSecondes++;

    // Emission websocket
    req.io?.emit('realtime-data', {
      debit,
      volume: realVolume,
      volumeMensuel: global.volumeMensuel.toFixed(2),
    });

    // Sauvegarde mensuelle

    if (global.moisActuel && global.moisActuel !== moisCourant) {
        try {
            // Sauvegarde le volume du mois écoulé
            await donneesMois.create({
                mois: global.moisActuel,
                volumeTotalMois: global.volumeMensuel,
            });

            console.log(`Mois ${global.moisActuel} sauvegardé avec succès.`);

            // Réinitialisation pour le nouveau mois
            global.volumeMensuel = 0;
            global.moisActuel = moisCourant;
        } catch (err) {
            console.error('Erreur enregistrement mensuel :', err.message);
        }
    }

  // Sauvegarde régulière toutes les minutes
  if (global.compteurSecondes % 60 === 0) {
    if (global.volumeHeure > 0 || global.volumeMensuel > 0 || global.volumeTotal > 0) {
      try {
        await donneesRegulieres.findOneAndUpdate(
          {}, // toujours un seul document
          {
            volumeHeure: global.volumeHeure,
            volumeMensuel: global.volumeMensuel,
            volumeTotal: global.volumeTotal,
            compteurSecondes: global.compteurSecondes,
            moisActuel: global.moisActuel
          },
          { upsert: true, new: true }
        );
        console.log('État régulier sauvegardé');
      } catch (err) {
        console.error('Erreur sauvegarde régulière :', err.message);
      }
    } else {
      console.log('Débit nul, état régulier non sauvegardé');
    }
  }

  // Sauvegarde toutes les heures
  if (global.compteurSecondes >= 3600) {
    const debitMoyen = global.volumeHeure / 60;

    try {
      const heureData = new donneesHeure({
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()),
        debitMoyen,
        volumeHeure: global.volumeHeure,
        volumeCumule: global.volumeTotal,
      });

      await heureData.save();

      global.volumeHeure = 0;
      global.compteurSecondes = 0;

      return res.status(200).json({ message: 'Heure complète : données enregistrées.' });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Erreur enregistrement horaire', details: err.message });
    }
  }

  return res
    .status(200)
    .json({ message: 'Données reçues', debit, volume: realVolume, volumeMensuel: global.volumeMensuel });
};


// Controller de get
exports.getDatas = async (req, res) => {
  try {
    // Récupérer les dernières données par heure (24h)
    const data = await donneesHeure
      .find()
      .sort({ date: -1 })
      .limit(24);

    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur récupération des données par heure :", err.message);
    res.status(500).json({ error: "Erreur récupération des données", details: err.message });
  }
};

exports.pingServer = (req, res) => {
  res.status(200).send('pong');
};
