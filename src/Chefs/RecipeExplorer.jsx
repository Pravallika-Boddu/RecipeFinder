import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard"; // Import the RecipeCard component
import "./RecipeExplorer.css"; // Ensure this CSS file exists for styling
import Header from "./Header";

const RecipeExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerances: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY; // Replace with your Spoonacular API key

  // Fetch random recipes on component mount
  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?number=20&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error fetching random recipes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        query: searchQuery,
        cuisine: filters.cuisine,
        diet: filters.diet,
        intolerances: filters.intolerances,
        type: filters.type,
        apiKey: API_KEY,
      });

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to search recipes");
      }
      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="recipe-explorer">
      <Header/>
      <h1>Explore All Recipes</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchRecipes}>Search</button>
      </div>

      {/* Filtering Options */}
      <div className="filters">
        <select name="cuisine" onChange={handleFilterChange}>
          <option value="">Cuisine</option>
          <option value="indian">Indian</option>
          <option value="italian">Italian</option>
          <option value="chinese">Chinese</option>
          <option value="mexican">Mexican</option>
          <option value="french">French</option>
          <option value="thai">Thai</option>
        </select>

        <select name="diet" onChange={handleFilterChange}>
          <option value="">Diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
        </select>

        <select name="intolerances" onChange={handleFilterChange}>
          <option value="">Intolerances</option>
          <option value="dairy">Dairy</option>
          <option value="peanut">Peanut</option>
          <option value="soy">Soy</option>
          <option value="egg">Egg</option>
        </select>

        <select name="type" onChange={handleFilterChange}>
          <option value="">Type</option>
          <option value="main course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="appetizer">Appetizer</option>
          <option value="salad">Salad</option>
        </select>
      </div>

      {/* Display Loading or Error Messages */}
      {loading && <p className="loading-message">Loading recipes...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {/* Display Recipes in a Grid */}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            image={recipe.image}
            readyInMinutes={recipe.readyInMinutes}
            servings={recipe.servings}
            isSaved={false} // You can manage saved state here
            onSaveToggle={() => {
              // Handle save toggle logic here
              console.log("Recipe saved:", recipe.title);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeExplorer;