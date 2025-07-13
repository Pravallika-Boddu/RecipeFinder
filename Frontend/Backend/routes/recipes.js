const express = require('express');
const User = require('../models/User'); // Import User schema
const Recipe = require('../models/recipe'); // Adjust the path as needed
const Upload = require('../models/upload');
const router = express.Router();
const Rating = require('../models/Rating');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});
const upload = multer({ storage });
// Get all saved recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get a single recipe by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findOne({ id: Number(id) });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save a recipe
router.post('/', async (req, res) => {
  const { recipe, userId } = req.body;

  // Validate required fields
  if (!recipe || !recipe.id || !recipe.title || !userId) {
    return res.status(400).json({ message: 'Invalid recipe data' });
  }

  try {
    // Check if recipe already exists for the user
    const existingRecipe = await Recipe.findOne({ id: recipe.id, userId });
    if (existingRecipe) {
      return res.status(409).json({ message: 'Recipe already saved' });
    }

    // Create new recipe
    const newRecipe = new Recipe({ ...recipe, userId });
    await newRecipe.save();

    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/upload', upload.single('image'), async (req, res) => {
  const recipeData = req.body;

  try {
    console.log('Received recipe data:', recipeData); // Log the incoming data

    // Validate required fields
    if (!recipeData.title || !recipeData.userId || !recipeData.image) {
      return res.status(400).json({ error: 'Title, userId, and image are required' });
    }

    // Check if the user exists and is a chef
    const user = await User.findById(recipeData.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role !== 'Chef') {
      return res.status(403).json({ error: 'Only chefs can upload recipes' });
    }

    // Ensure the image is a string
    if (typeof recipeData.image !== 'string') {
      return res.status(400).json({ error: 'Image must be a string (URL or base64)' });
    }
    if (recipeData.extendedIngredients && Array.isArray(recipeData.extendedIngredients)) {
      recipeData.extendedIngredients = recipeData.extendedIngredients.map(ingredient => {
        const numericValue = parseFloat(ingredient.amount);
        return {
          ...ingredient,
          amount: isNaN(numericValue) ? 0 : numericValue, // Default to 0 if parsing fails
        };
      });
    }

    // Create a new recipe
    const recipe = new Upload(recipeData);
    await recipe.save();

    console.log('Recipe saved successfully:', recipe); // Log the saved recipe
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error saving recipe:', error); // Log the full error
    res.status(500).json({ error: 'Failed to upload recipe', details: error.message });
  }
});
// Update a recipe
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { recipe } = req.body;

  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { id: Number(id) },
      { ...recipe },
      { new: true } // Return the updated document
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a saved recipe
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Ensure the recipe belongs to the user
    const recipe = await Recipe.findOne({ id: Number(id), userId });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await Recipe.findOneAndDelete({ id: Number(id), userId });
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/:id/rate', async (req, res) => {
  const { id } = req.params; // Spoonacular recipe ID
  const { rating, userId } = req.body;

  try {
    console.log(`Attempting to rate recipe ${id} with rating ${rating} by user ${userId}`);

    // Check if the user has already rated this recipe
    const existingRating = await Rating.findOne({ recipeId: parseInt(id), userId });

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
      await existingRating.save();
      console.log(`Updated existing rating for user ${userId}`);
    } else {
      // Add a new rating
      const newRating = new Rating({ recipeId: parseInt(id), userId, rating });
      await newRating.save();
      console.log(`Added new rating for user ${userId}`);
    }

    // Calculate the average rating for the recipe
    const ratings = await Rating.find({ recipeId: parseInt(id) });
    const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / ratings.length;

    res.status(200).json({ message: 'Rating updated successfully', averageRating });
  } catch (err) {
    console.error('Error rating recipe:', err);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});
// Get average rating for a recipe
// Backend route to fetch average rating
router.get('/:id/rating', async (req, res) => {
  const { id } = req.params; // Spoonacular recipe ID

  try {
    const ratings = await Rating.find({ recipeId: parseInt(id) });

    if (ratings.length === 0) {
      return res.status(200).json({ averageRating: 0 });
    }

    const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / ratings.length;

    res.status(200).json({ averageRating });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});
// Get recipes by user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Search recipes
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { ingredients: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; // Export the router