import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "./RecipeCard"; // Import the RecipeCard component
import { Clock, Users, Heart } from "lucide-react"; // Import icons
import Header from './Header';
const CuisineExplorer = () => {
  const { cuisine } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    diet: "",
    intolerances: "",
    type: "",
  });
  const [savedRecipes, setSavedRecipes] = useState(new Set()); // Track saved recipe IDs
  const [loading, setLoading] = useState(false); // Add loading state

  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY; // Replace with your Spoonacular API key

  // Fetch recipes for the selected cuisine
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        const recipesWithDetails = await Promise.all(
          data.results.map(async (recipe) => {
            const detailsResponse = await fetch(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
            );
            const details = await detailsResponse.json();
            return { ...recipe, ...details }; // Merge basic and detailed information
          })
        );
        setRecipes(recipesWithDetails);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [cuisine]);

  // Handle search with filters
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?cuisine=${cuisine}&query=${searchQuery}&diet=${filters.diet}&intolerances=${filters.intolerances}&type=${filters.type}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      const recipesWithDetails = await Promise.all(
        data.results.map(async (recipe) => {
          const detailsResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipech.id}/information?apiKey=${API_KEY}`
          );
          const details = await detailsResponse.json();
          return { ...recipe, ...details }; // Merge basic and detailed information
        })
      );
      setRecipes(recipesWithDetails);
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save toggle for recipes
  const handleSaveToggle = (recipeId) => {
    const newSavedRecipes = new Set(savedRecipes);
    if (newSavedRecipes.has(recipeId)) {
      newSavedRecipes.delete(recipeId);
    } else {
      newSavedRecipes.add(recipeId);
    }
    setSavedRecipes(newSavedRecipes);
  };

  return (
    <div className="recipe-explorer">
      <Header/>
      <h1>{cuisine} Recipes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="filters">
        <select
          value={filters.diet}
          onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
        >
          <option value="">Select Diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
        </select>
        <select
          value={filters.intolerances}
          onChange={(e) => setFilters({ ...filters, intolerances: e.target.value })}
        >
          <option value="">Select Intolerances</option>
          <option value="dairy">Dairy</option>
          <option value="peanut">Peanut</option>
          <option value="gluten">Gluten</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="main course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="appetizer">Appetizer</option>
        </select>
      </div>
      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              image={recipe.image}
              readyInMinutes={recipe.readyInMinutes} // Now available
              servings={recipe.servings} // Now available
              isSaved={savedRecipes.has(recipe.id)}
              onSaveToggle={() => handleSaveToggle(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CuisineExplorer;

// CSS Styles
const styles = `
  .recipe-explorer {
    padding: 20px;
  }

  .search-bar {
    margin-bottom: 20px;
  }

  .search-bar input {
    padding: 10px;
    width: 300px;
    margin-right: 10px;
  }

  .search-bar button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  .filters {
    margin-bottom: 20px;
  }

  .filters select {
    padding: 10px;
    margin-right: 10px;
  }

  .recipe-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);