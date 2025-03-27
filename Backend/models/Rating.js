const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  recipeId: { type: Number, required: true }, // Spoonacular recipe ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who rated
  rating: { type: Number, min: 1, max: 5, required: true }, // Rating value (1-5)
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Rating', ratingSchema);