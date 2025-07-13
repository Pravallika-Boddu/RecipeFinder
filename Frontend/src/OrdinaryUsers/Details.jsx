import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Heart, Share2, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbarr';

const Details = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);

  // Fetch recipe details by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chefs/${id}`);
        setRecipe(response.data);
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.title,
        text: `Check out this recipe: ${recipe?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>{error || 'Recipe not found'}</div>
      </div>
    );
  }

  // Split instructions into steps based on newline characters
  const instructionsSteps = recipe.instructions?.split('\n').filter(step => step.trim() !== '');
  const displayedInstructions = showAllInstructions
    ? instructionsSteps
    : instructionsSteps?.slice(0, 3);

  const displayedIngredients = showAllIngredients
    ? recipe.extendedIngredients
    : recipe.extendedIngredients?.slice(0, 8);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.recipeContainer}>
          {/* Recipe Header */}
          <div style={styles.recipeHeader}>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={styles.recipeImage}
            />
            <div style={styles.recipeOverlay}>
              <div style={styles.recipeTitleContainer}>
                <h1 style={styles.recipeTitle}>{recipe.title}</h1>
                <div style={styles.recipeInfo}>
                  <div style={styles.recipeInfoItem}>
                    <Clock size={16} style={styles.icon} />
                    <span>{recipe.readyInMinutes} min</span>
                  </div>
                  <div style={styles.recipeInfoItem}>
                    <Users size={16} style={styles.icon} />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              onClick={handleShare}
              style={styles.actionButton}
            >
              <Share2 size={18} style={styles.actionIcon} />
              Share
            </button>

            <button
              onClick={handlePrint}
              style={styles.actionButton}
            >
              <Printer size={18} style={styles.actionIcon} />
              Print
            </button>
          </div>

          <div style={styles.contentGrid}>
            {/* Left Column - Ingredients */}
            <div style={styles.ingredientsColumn}>
              <h2 style={styles.sectionTitle}>Ingredients</h2>
              <ul style={styles.ingredientsList}>
                {displayedIngredients?.map((ingredient, index) => (
                  <li key={index} style={styles.ingredientItem}>
                    <span style={styles.ingredientBullet}></span>
                    <span>{ingredient.original}</span>
                  </li>
                ))}
              </ul>

              {recipe.extendedIngredients?.length > 8 && (
                <button
                  onClick={() => setShowAllIngredients(!showAllIngredients)}
                  style={styles.showMoreButton}
                >
                  {showAllIngredients ? (
                    <>Show Less <ChevronUp size={16} style={styles.chevronIcon} /></>
                  ) : (
                    <>Show All ({recipe.extendedIngredients.length}) <ChevronDown size={16} style={styles.chevronIcon} /></>
                  )}
                </button>
              )}
            </div>

            {/* Right Column - Instructions */}
            <div style={styles.instructionsColumn}>
              <h2 style={styles.sectionTitle}>Instructions</h2>
              {displayedInstructions?.length > 0 ? (
                <ol style={styles.instructionsList}>
                  {displayedInstructions.map((step, index) => (
                    <li key={index} style={styles.instructionItem}>
                      <span style={styles.stepNumber}>{index + 1}</span>
                      <div style={styles.stepContent}>
                        <p>{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={styles.noInstructions}>No detailed instructions available.</p>
              )}

              {instructionsSteps?.length > 3 && (
                <button
                  onClick={() => setShowAllInstructions(!showAllInstructions)}
                  style={styles.showMoreButton}
                >
                  {showAllInstructions ? (
                    <>Show Less <ChevronUp size={16} style={styles.chevronIcon} /></>
                  ) : (
                    <>Show All Steps <ChevronDown size={16} style={styles.chevronIcon} /></>
                  )}
                </button>
              )}

              {/* Additional Info */}
              <div style={styles.additionalInfo}>
                {recipe.diets?.length > 0 && (
                  <div>
                    <h3 style={styles.sectionTitle}>Diets</h3>
                    <div style={styles.tags}>
                      {recipe.diets.map((diet, index) => (
                        <span key={index} style={styles.tag}>
                          {diet}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {recipe.dishTypes?.length > 0 && (
                  <div>
                    <h3 style={styles.sectionTitle}>Dish Types</h3>
                    <div style={styles.tags}>
                      {recipe.dishTypes.map((type, index) => (
                        <span key={index} style={styles.tag}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  recipeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  recipeHeader: {
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '256px',
    objectFit: 'cover',
  },
  recipeOverlay: {
    position: 'absolute',
    inset: '0',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '24px',
  },
  recipeTitleContainer: {
    color: '#ffffff',
  },
  recipeTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  recipeInfo: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
  },
  recipeInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  icon: {
    marginRight: '4px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  actionIcon: {
    marginRight: '8px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    padding: '24px',
  },
  ingredientsColumn: {
    gridColumn: '1 / -1',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  ingredientsList: {
    listStyle: 'none',
    padding: '0',
    marginBottom: '16px',
  },
  ingredientItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  ingredientBullet: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  showMoreButton: {
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
  },
  chevronIcon: {
    marginLeft: '4px',
  },
  instructionsColumn: {
    gridColumn: '1 / -1',
  },
  instructionsList: {
    listStyle: 'none',
    padding: '0',
    marginBottom: '16px',
  },
  instructionItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#d1fae5',
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    flexShrink: '0',
  },
  stepContent: {
    paddingTop: '4px',
  },
  noInstructions: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  additionalInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '24px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tag: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '14px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '384px',
  },
  spinner: {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #10b981',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
};

export default Details;