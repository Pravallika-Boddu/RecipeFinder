const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  readyInMinutes: { type: Number, required: true },
  servings: { type: Number, required: true },
  sourceUrl: { type: String },
  summary: { type: String },
  instructions: { type: String },
  extendedIngredients: [{ 
    id: Number,
    name: String,
    amount: Number,
    unit: String,
    original: String
  }],
  analyzedInstructions: [{
    name: String,
    steps: [{
      number: Number,
      step: String,
      ingredients: [{
        id: Number,
        name: String
      }],
      equipment: [{
        id: Number,
        name: String
      }]
    }]
  }],
  diets: [String],
  dishTypes: [String],
  cuisines: [String],
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who rated
    rating: { type: Number, min: 1, max: 5 }, // Rating value (1-5)
    createdAt: { type: Date, default: Date.now } // Timestamp
  }],
  averageRating: { type: Number, default: 0 }, // Average rating
  views: { type: Number, default: 0 }, // Views count
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipe creator
  createdAt: { type: Date, default: Date.now } // Recipe creation date
});

// Calculate average rating before saving
recipeSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);