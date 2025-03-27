import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../OrdinaryUsers/SearchBar';
import RecipeCard from '../OrdinaryUsers/RecipeCard';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import {
  searchRecipes,
  searchRecipesByIngredients,
  getSavedRecipeIds,
  saveRecipe,
  unsaveRecipe
} from '../services/api';
import Navbar from '../OrdinaryUsers/Navbarr';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const searchType = queryParams.get('type') || 'recipe';
  const category = queryParams.get('category') || '';
  
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [diet, setDiet] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [maxReadyTime, setMaxReadyTime] = useState('');
  
  const diets = ['Vegetarian', 'Vegan', 'Gluten Free', 'Ketogenic', 'Paleo'];
  const cuisines = ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French'];

  // Load saved recipe IDs on mount
  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        const savedIds = await getSavedRecipeIds();
        setSavedRecipeIds(new Set(savedIds));
      } catch (err) {
        console.error('Error loading saved recipes:', err);
      }
    };
    loadSavedRecipes();
  }, []);

  // Perform the search whenever query / filters change
  useEffect(() => {
    const searchForRecipes = async () => {
      if (!query && !category) return;
      
      try {
        setLoading(true);
        setError(null);
        
        let results;
        if (category) {
          // Search by category
          results = await searchRecipes('', { 
            type: category.toLowerCase(),
            diet,
            cuisine,
            maxReadyTime: maxReadyTime ? parseInt(maxReadyTime) : undefined
          });
        } else if (searchType === 'ingredients') {
          // Search by ingredients
          const ingredients = query.split(',').map(i => i.trim());
          results = await searchRecipesByIngredients(ingredients);
        } else {
          // Search by recipe name
          results = await searchRecipes(query, {
            diet,
            cuisine,
            maxReadyTime: maxReadyTime ? parseInt(maxReadyTime) : undefined
          });
        }
        
        setRecipes(results);
      } catch (err) {
        setError('Failed to load search results. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchForRecipes();
  }, [query, searchType, category, diet, cuisine, maxReadyTime]);

  // Handle saving/unsaving recipes
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

  // Apply filters and update the URL
  const applyFilters = () => {
    const params = new URLSearchParams(location.search);
    
    if (diet) params.set('diet', diet);
    else params.delete('diet');
    
    if (cuisine) params.set('cuisine', cuisine);
    else params.delete('cuisine');
    
    if (maxReadyTime) params.set('maxReadyTime', maxReadyTime);
    else params.delete('maxReadyTime');
    
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setDiet('');
    setCuisine('');
    setMaxReadyTime('');
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (searchType) params.set('type', searchType);
    if (category) params.set('category', category);
    
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* 1. SEARCH BAR */}
        <div style={{ marginBottom: '20px' }}>
          <SearchBar placeholder="Refine your search..." />
        </div>

        {/* 2. FILTERS */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Filter size={18} style={{ marginRight: '8px', color: '#4a4a4a' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#4a4a4a' }}>Filters</h2>
            </div>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {showFilters && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#4a4a4a' }}>Diet</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}
                  >
                    <option value="">Any</option>
                    {diets.map((d) => (
                      <option key={d} value={d.toLowerCase()}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#4a4a4a' }}>Cuisine</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}
                  >
                    <option value="">Any</option>
                    {cuisines.map((c) => (
                      <option key={c} value={c.toLowerCase()}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: '#4a4a4a' }}>Max Ready Time</label>
                  <select
                    value={maxReadyTime}
                    onChange={(e) => setMaxReadyTime(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}
                  >
                    <option value="">Any</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={resetFilters}
                  style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer' }}
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. SEARCH RESULTS */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '16px' }}>
            {category ? `${category} Recipes` : `Search Results for "${query}"`}
          </h2>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#dc2626', padding: '32px 0' }}>{error}</div>
          ) : recipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>No recipes found</h2>
              <p style={{ fontSize: '1rem', color: '#4a4a4a', marginBottom: '16px' }}>Try adjusting your search terms or filters</p>
              <button
                onClick={resetFilters}
                style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
              {recipes.map((recipe) => (
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
        </div>
      </div>
    </div>
  );
};

export default SearchResults;