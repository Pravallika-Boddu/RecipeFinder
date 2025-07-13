const express = require('express');
const router = express.Router();
const Upload = require('../models/upload'); // Import the Upload model
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
router.get('/fetch/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching recipes for user ID:', userId);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Convert userId to ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Query the database
    const recipes = await Upload.find({ userId: objectIdUserId });
    console.log('Recipes found:', recipes);

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this user.' });
    }

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes.' });
  }
});

router.get('/fetch/user/:userId/recipe/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    console.log('Fetching recipe for userId:', userId, 'and recipeId:', recipeId);

    // Validate userId and recipeId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid user ID or recipe ID' });
    }

    // Fetch the recipe for the specific user and recipe ID
    const recipe = await Upload.findOne({ _id: recipeId, userId });

    if (!recipe) {
      console.log('Recipe not found for userId:', userId, 'and recipeId:', recipeId);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Return the recipe
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/chefs', async (req, res) => {
  try {
    const recipes = await Upload.find({});
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
});
// Fetch a specific recipe by ID
router.get('/chefs/:id', async (req, res) => {
  try {
    const recipe = await Upload.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
});
module.exports = router;