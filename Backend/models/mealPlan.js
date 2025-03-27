const mongoose = require('mongoose');
const mealPlanSchema = mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday", "Tuesday"
  meals: {
    breakfast: {
      id: Number,
      title: String,
      image: String,
      readyInMinutes: Number,
      servings: Number
    },
    lunch: {
      id: Number,
      title: String,
      image: String,
      readyInMinutes: Number,
      servings: Number
    },
    dinner: {
      id: Number,
      title: String,
      image: String,
      readyInMinutes: Number,
      servings: Number
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// Update the updatedAt field before saving
mealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);