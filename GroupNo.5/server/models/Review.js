const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username:   { type: String, required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);