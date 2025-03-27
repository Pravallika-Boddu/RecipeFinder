import React, { useState, useEffect } from 'react';
import SearchBar from '../OrdinaryUsers/SearchBar';
import RecipeCard from '../OrdinaryUsers/RecipeCard';
import Navbarr from '../OrdinaryUsers/Navbarr'
import { ChevronRight } from 'lucide-react';
import { fetchRandomRecipes, saveRecipe, unsaveRecipe, getSavedRecipeIds } from '../services/api';
import { useNavigate } from 'react-router-dom'; // For navigation

const Home = () => {
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const recipes = await fetchRandomRecipes(10); // Fetch 10 recipes for 2 rows
        setRandomRecipes(recipes || []);
        
        const savedIds = await getSavedRecipeIds();
        setSavedRecipeIds(new Set(savedIds || []));
      } catch (err) {
        setError('Failed to load recipes. Please try again later.');
        console.error('Error in loadData:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveToggle = async (recipe) => {
    try {
      if (savedRecipeIds.has(recipe.id)) {
        await unsaveRecipe(recipe.id);
        setSavedRecipeIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipe.id);
          return newSet;
        });
      } else {
        await saveRecipe(recipe);
        setSavedRecipeIds(prev => new Set(prev).add(recipe.id));
      }
    } catch (err) {
      console.error('Error toggling save status:', err);
    }
  };

  const categories = [
    { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Lunch', image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Dinner', image: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div>
      <Navbarr />
      <div style={styles.container}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Find the Perfect Recipe for Any Occasion</h1>
            <p style={styles.heroSubtitle}>Search by recipe name or ingredients you have on hand</p>
            <SearchBar style={styles.searchBar} />
          </div>
        </section>

        {/* Categories */}
        <section style={styles.categoriesSection}>
          <div style={styles.categoriesHeader}>
            <h2 style={styles.categoriesTitle}>Popular Categories</h2>
            <a href="/search" style={styles.viewAllLink}>
              View All <ChevronRight size={16} />
            </a>
          </div>
          <div style={styles.categoriesGrid}>
            {categories.map((category) => (
              <a 
                key={category.name}
                href={`/search?category=${category.name.toLowerCase()}`}
                style={styles.categoryCard}
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  style={styles.categoryImage}
                />
                <div style={styles.categoryOverlay}>
                  <h3 style={styles.categoryName}>{category.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Recipe Inspiration */}
        <section style={styles.recipeSection}>
          <h2 style={styles.recipeTitle}>Recipe Recommendations</h2>
          
          {loading ? (
            <div style={styles.loadingSpinner}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorMessage}>{error}</div>
          ) : (
            <div style={styles.recipesGrid}>
              {randomRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  image={recipe.image}
                  readyInMinutes={recipe.readyInMinutes}
                  servings={recipe.servings}
                  isSaved={savedRecipeIds.has(recipe.id)}
                  onSaveToggle={() => handleSaveToggle(recipe)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '0',
  },
  heroSection: {
    background: 'linear-gradient(to right, #16a34a, #22c55e)',
    padding: '32px 16px',
    marginBottom: '32px',
  },
  heroContent: {
    maxWidth: '768px',
    margin: '0 auto',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '24px',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'white',
    marginBottom: '32px',
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    maxWidth: '672px',
    margin: '0 auto',
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: 1,
    maxWidth: '200px',
  },
  searchButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: 'white',
    cursor: 'pointer',
    flexShrink: 0,
  },
  categoriesSection: {
    padding: '0 16px',
    marginBottom: '32px',
  },
  categoriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  categoriesTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllLink: {
    color: '#16a34a',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  categoryCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.3s',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  categoryImage: {
    width: '100%',
    height: '128px',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
  categoryName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
  },
  recipeSection: {
    padding: '0 16px',
    marginBottom: '32px',
  },
  recipeTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '24px',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '256px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #16a34a',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    textAlign: 'center',
    color: '#ef4444',
    padding: '32px 0',
  },
  recipesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 recipes per row
    gap: '16px',
  },
};

export default Home;