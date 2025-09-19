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

    // Volume en temps réel
    const realVolume = debit / 60;

    // Mise à jour des compteurs
    global.volumeHeure += realVolume;
    global.volumeMensuel += realVolume;
    global.volumeTotal += realVolume;

    // Emission websocket
    req.io?.emit('realtime-data', {
      debit,
      volume: realVolume,
      volumeMensuel: global.volumeMensuel.toFixed(2),
    });

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
