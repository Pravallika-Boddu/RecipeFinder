import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';
const RecipeCard = ({
  id,
  title,
  image,
  readyInMinutes,
  servings,
  isSaved = false,
  onSaveToggle
}) => {
  return (
    <div>
      
    <div style={styles.recipeCard}>
      <Link to={`/recipe/${id}`}>
        <img 
          src={image} 
          alt={title} 
          style={styles.recipeImage}
        />
      </Link>
      <div style={styles.recipeDetails}>
        <div style={styles.recipeHeader}>
          <Link to={`/recipe/${id}`}>
            <h3 style={styles.recipeTitle}>{title}</h3>
          </Link>
          {onSaveToggle && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onSaveToggle();
              }}
              style={styles.likeButton}
            >
              <Heart 
                size={20} 
                fill={isSaved ? "#ef4444" : "none"} 
                color={isSaved ? "#ef4444" : "currentColor"} 
              />
            </button>
          )}
        </div>
        
        <div style={styles.recipeInfo}>
          <div style={styles.recipeInfoItem}>
            <Clock size={16} style={styles.recipeIcon} />
            <span>{readyInMinutes} min</span>
          </div>
          <div style={styles.recipeInfoItem}>
            <Users size={16} style={styles.recipeIcon} />
            <span>{servings} servings</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const styles = {
  recipeCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  recipeImage: {
    width: '100%',
    height: '200px', // Fixed height for consistent image size
    objectFit: 'cover', // Ensures the image covers the area without distortion
  },
  recipeDetails: {
    padding: '12px',
    flex: 1,
  },
  recipeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  recipeTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    ':hover': {
      color: '#16a34a',
    },
  },
  likeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfo: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.875rem',
    color: '#666',
  },
  recipeInfoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  recipeIcon: {
    color: '#666',
  },
};

export default RecipeCard;