import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_API = 'https://api.spoonacular.com';
const SERVER_API = 'https://recipefinder-99mo.onrender.com/api';

// Spoonacular API calls
export const fetchRandomRecipes = async (number = 10, options = {}) => {
  try {
    if (!API_KEY || API_KEY === 'your_spoonacular_api_key') {
      return getMockRecipes(number);
    }

    const response = await axios.get(`${SPOONACULAR_API}/recipes/random`, {
      params: { apiKey: API_KEY, number, ...options },
    });
    return response.data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return getMockRecipes(number);
  }
};

export const fetchRecipeById = async (id) => {
  try {
    if (!API_KEY || API_KEY === 'your_spoonacular_api_key') {
      return getMockRecipeById(id);
    }

    const response = await axios.get(`${SPOONACULAR_API}/recipes/${id}/information`, {
      params: { apiKey: API_KEY, includeNutrition: true },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    return getMockRecipeById(id);
  }
};

export const searchRecipes = async (query, options = {}) => {
  try {
    if (!API_KEY || API_KEY === 'your_spoonacular_api_key') {
      return getMockSearchResults(query);
    }

    const response = await axios.get(`${SPOONACULAR_API}/recipes/complexSearch`, {
      params: { apiKey: API_KEY, query, number: 20, addRecipeInformation: true, fillIngredients: true, ...options },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return getMockSearchResults(query);
  }
};

export const searchRecipesByIngredients = async (ingredients) => {
  try {
    if (!API_KEY || API_KEY === 'your_spoonacular_api_key') {
      return getMockRecipes(20);
    }

    const response = await axios.get(`${SPOONACULAR_API}/recipes/findByIngredients`, {
      params: { apiKey: API_KEY, ingredients: ingredients.join(','), number: 20, ranking: 1, ignorePantry: false },
    });

    const recipeIds = response.data.map((recipe) => recipe.id);
    const detailedRecipes = await Promise.all(recipeIds.map((id) => fetchRecipeById(id)));

    return detailedRecipes;
  } catch (error) {
    console.error('Error searching recipes by ingredients:', error);
    return getMockRecipes(20);
  }
};

export const saveRecipe = async (recipe) => {
  try {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID is missing. Please log in again.');
    }

    const response = await axios.post(`${SERVER_API}/recipes`, { recipe, userId });
    return response.data;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error; // Propagate the error for handling in the UI
  }
};

// Unsave a recipe
export const unsaveRecipe = async (recipeId) => {
  try {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID is missing. Please log in again.');
    }

    const response = await axios.delete(`${SERVER_API}/recipes/${recipeId}`, {
      data: { userId }, // Send userId in the request body
    });
    return response.data;
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    throw error; // Propagate the error for handling in the UI
  }
};

// Get all saved recipes
export const getSavedRecipes = async () => {
  try {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID is missing. Please log in again.');
    }

    const response = await axios.get(`${SERVER_API}/recipes/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error; // Propagate the error for handling in the UI
  }
};

// Get saved recipe IDs
export const getSavedRecipeIds = async () => {
  try {
    const savedRecipes = await getSavedRecipes();
    return savedRecipes.map(recipe => recipe.id);
  } catch (error) {
    console.error('Error getting saved recipe IDs:', error);
    throw error; // Propagate the error for handling in the UI
  }
};
export const rateRecipe = async (recipeId, rating) => {
  try {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID is missing. Please log in again.');
    }

    const response = await axios.post(`${SERVER_API}/recipes/${recipeId}/rate`, { rating, userId });
    return response.data;
  } catch (error) {
    console.error('Error rating recipe:', error);
    throw error; // Propagate the error for handling in the UI
  }
};

// Fetch average rating for a recipe
export const fetchAverageRating = async (recipeId) => {
  try {
    const response = await axios.get(`${SERVER_API}/recipes/${recipeId}/rating`);
    return response.data.averageRating;
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return 0; // Return 0 if there's an error
  }
};

export const getMealPlan = async (userId) => {
  try {
    const response = await axios.get(`${SERVER_API}/mealPlan`, { params: { userId } });
    console.log("Meal plan fetched from API:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error getting meal plan:', error);
    return [];
  }
};
export const saveMealPlan = async (mealPlan, userId) => {
  try {
    const response = await axios.post(`${SERVER_API}/mealPlan`, { mealPlan, userId });
    return response; // Return the full response object
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error; // Propagate the error for handling in the UI
  }
};
export const getRecipes = async () => {
  try {
    const response = await fetch(`${SERVER_API}/recipes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
export const getChefProfile = async () => {
  try {
    const response = await fetch(`${SERVER_API}/chef`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await fetch(`${SERVER_API}/chef/analytics`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};
// Mock data for development
const getMockRecipes = (number = 10) => {
  const recipes = [];
  for (let i = 1; i <= number; i++) {
    recipes.push({
      id: 1000 + i,
      title: `Mock Recipe ${i}`,
      image: `https://images.unsplash.com/photo-${1550000000 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
      readyInMinutes: 30,
      servings: 4,
      summary: "This is a mock recipe summary.",
      instructions: "These are mock recipe instructions.",
      extendedIngredients: [
        { id: 1, name: "Ingredient 1", amount: 1, unit: "cup", original: "1 cup of Ingredient 1" },
        { id: 2, name: "Ingredient 2", amount: 2, unit: "tbsp", original: "2 tbsp of Ingredient 2" }
      ],
      analyzedInstructions: [{
        name: "",
        steps: [
          { number: 1, step: "Step 1 of the recipe", ingredients: [], equipment: [] },
          { number: 2, step: "Step 2 of the recipe", ingredients: [], equipment: [] }
        ]
      }],
      diets: ["vegetarian"],
      dishTypes: ["main course"],
      cuisines: ["american"]
    });
  }
  return recipes;
};

const getMockRecipeById = (id) => {
  return {
    id,
    title: `Recipe ${id}`,
    image: `https://images.unsplash.com/photo-${1550000000 + id}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
    readyInMinutes: 30,
    servings: 4,
    summary: "This is a mock recipe summary.",
    instructions: "These are mock recipe instructions.",
    extendedIngredients: [
      { id: 1, name: "Ingredient 1", amount: 1, unit: "cup", original: "1 cup of Ingredient 1" },
      { id: 2, name: "Ingredient 2", amount: 2, unit: "tbsp", original: "2 tbsp of Ingredient 2" }
    ],
    analyzedInstructions: [{
      name: "",
      steps: [
        { number: 1, step: "Step 1 of the recipe", ingredients: [], equipment: [] },
        { number: 2, step: "Step 2 of the recipe", ingredients: [], equipment: [] }
      ]
    }],
    diets: ["vegetarian"],
    dishTypes: ["main course"],
    cuisines: ["american"]
  };
};

const getMockSearchResults = (query) => {
  const recipes = [];
  for (let i = 1; i <= 20; i++) {
    recipes.push({
      id: 2000 + i,
      title: `${query} Recipe ${i}`,
      image: `https://images.unsplash.com/photo-${1550000000 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
      readyInMinutes: 30,
      servings: 4,
      summary: `This is a mock recipe summary for ${query}.`,
      instructions: `These are mock recipe instructions for ${query}.`,
      extendedIngredients: [
        { id: 1, name: "Ingredient 1", amount: 1, unit: "cup", original: "1 cup of Ingredient 1" },
        { id: 2, name: "Ingredient 2", amount: 2, unit: "tbsp", original: "2 tbsp of Ingredient 2" }
      ],
      analyzedInstructions: [{
        name: "",
        steps: [
          { number: 1, step: "Step 1 of the recipe", ingredients: [], equipment: [] },
          { number: 2, step: "Step 2 of the recipe", ingredients: [], equipment: [] }
        ]
      }],
      diets: ["vegetarian"],
      dishTypes: ["main course"],
      cuisines: ["american"]
    });
  }
  return recipes;
};