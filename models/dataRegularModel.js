const mongoose = require('mongoose');

const dataRegularSchema = new mongoose.Schema({
  volumeHeure: { type: Number, default: 0 },
  volumeMensuel: { type: Number, default: 0 },
  volumeTotal: { type: Number, default: 0 },
  compteurSecondes: { type: Number, default: 0 },
  moisActuel: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('dataRegularSchema', dataRegularSchema);
