import React, { useState, useEffect } from 'react';
import RecipeCard from '../OrdinaryUsers/RecipeCard';
import { Trash2 } from 'lucide-react';
import { getSavedRecipes, unsaveRecipe } from '../services/api';
import Navbar from '../OrdinaryUsers/Navbarr';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        setLoading(true);
        const savedRecipes = await getSavedRecipes();
        if (savedRecipes.length === 0) {
          setError('No saved recipes found.');
        } else {
          setRecipes(savedRecipes);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No saved recipes found.');
        } else {
          setError('Failed to load saved recipes. Please try again later.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedRecipes();
  }, []);

  const handleUnsave = async (recipeId) => {
    try {
      await unsaveRecipe(recipeId);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
    } catch (err) {
      console.error('Error removing recipe:', err);
      setError('Failed to unsave recipe. Please try again later.');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved recipes?')) {
      try {
        const unsavePromises = recipes.map((recipe) => unsaveRecipe(recipe.id));
        await Promise.all(unsavePromises);
        setRecipes([]);
      } catch (err) {
        console.error('Error clearing recipes:', err);
        setError('Failed to clear all recipes. Please try again later.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Saved Recipes</h1>
          {recipes.length > 0 && (
            <button
              onClick={handleClearAll}
              style={styles.clearAllButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#fecaca')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#fee2e2')}
            >
              <Trash2 size={18} style={styles.trashIcon} />
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner}></div>
          </div>
        ) : error ? (
          <div style={styles.errorMessage}>{error}</div>
        ) : recipes.length === 0 ? (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyStateTitle}>No saved recipes yet</h2>
            <p style={styles.emptyStateText}>Start saving your favorite recipes to access them later</p>
            <a
              href="/normal"
              style={styles.discoverRecipesButton}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#059669')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#10b981')}
            >
              Discover Recipes
            </a>
          </div>
        ) : (
          <div style={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                readyInMinutes={recipe.readyInMinutes}
                servings={recipe.servings}
                isSaved={true}
                onSaveToggle={() => handleUnsave(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// CSS Styles (same as before)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clearAllButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  trashIcon: {
    marginRight: '8px',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '256px',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#dc2626',
    padding: '32px 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 0',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  emptyStateTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  emptyStateText: {
    color: '#4b5563',
    marginBottom: '24px',
  },
  discoverRecipesButton: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
  },
};

export default SavedRecipes;