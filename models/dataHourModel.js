const mongoose = require('mongoose');

const donneesParHeure = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  debitMoyen: Number,
  volumeHeure: Number,
  volumeCumule: Number
});

module.exports = mongoose.model('donneesParHeure', donneesParHeure);
