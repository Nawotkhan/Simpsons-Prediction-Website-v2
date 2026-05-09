const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  episodeTitle:  { type: String, required: true, trim: true },
  interpretation:{ type: String, required: true },
  proofImages:   [{ type: String }],
  timeline:      [{ type: String }],
  references:    [{ type: String }],
  submittedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);