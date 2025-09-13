const mongoose = require('mongoose');

const donneesParMois = new mongoose.Schema({
  mois: { type: String, required: true, unique: true }, // ex: "2025-09"
  volumeTotalMois: Number,
  dateSauvegarde: { type: Date, default: Date.now }
});

module.exports = mongoose.model('donneesParMois', donneesParMois);
