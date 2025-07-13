const express = require('express');
const MealPlan = require('../models/mealPlan'); // Adjust the path as needed

const router = express.Router();

// Get meal plan
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log("Fetching meal plan for user:", userId); // Debug log
    const mealPlans = await MealPlan.find({ userId }).sort({ day: 1 });
    console.log("Meal plans fetched:", mealPlans); // Debug log
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// Save meal plan
const isValidMealPlan = (mealPlan) => {
  return Array.isArray(mealPlan) && mealPlan.every(dayPlan => 
    typeof dayPlan.day === 'string' && 
    (typeof dayPlan.meals === 'object' || dayPlan.meals === undefined)
  );
};
router.post('/', async (req, res) => {
  const { mealPlan, userId } = req.body;

  // Validate mealPlan data
  if (!isValidMealPlan(mealPlan)) {
    return res.status(400).json({ message: 'Invalid meal plan data' });
  }

  try {
    // Delete existing meal plans for the user
    await MealPlan.deleteMany({ userId }); // Add this line

    // Create new meal plans
    const savedMealPlans = await Promise.all(
      mealPlan.map(async (dayPlan) => {
        const newMealPlan = new MealPlan({
          day: dayPlan.day,
          meals: dayPlan.meals || {},
          userId
        });
        return await newMealPlan.save();
      })
    );

    // Return a success message and the saved meal plans
    res.status(201).json({ 
      message: 'Meal plan saved successfully',
      data: savedMealPlans 
    });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;