const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Recipe title
  image: { type: String, required: true }, // Recipe image URL
  readyInMinutes: { type: Number, required: true }, // Cooking time
  servings: { type: Number, required: true }, // Number of servings
  sourceUrl: { type: String }, // Source URL (optional)
  summary: { type: String, required: true }, // Recipe summary
  instructions: { type: String, required: true }, // Cooking instructions
  extendedIngredients: [ // List of ingredients
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      unit: { type: String, required: true },
      original: { type: String, required: true },
    },
  ],
  analyzedInstructions: [ // Cooking steps
    {
      name: { type: String, required: true },
      steps: [
        {
          number: { type: Number, required: true },
          step: { type: String, required: true },
          ingredients: [
            {
              id: { type: Number, required: true },
              name: { type: String, required: true },
            },
          ],
          equipment: [
            {
              id: { type: Number, required: true },
              name: { type: String, required: true },
            },
          ],
        },
      ],
    },
  ],
  diets: [{ type: String }], // List of diets (e.g., Vegetarian, Vegan)
  dishTypes: [{ type: String }], // List of dish types (e.g., Main Course, Dessert)
  cuisines: [{ type: String }], // List of cuisines (e.g., Indian, Italian)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// Reference to the user
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('Upload', uploadSchema);