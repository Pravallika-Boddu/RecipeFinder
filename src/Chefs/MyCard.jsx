import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
const MyCard = ({ recipe }) => {
  const imageUrl = recipe.image.startsWith('data:image') 
    ? recipe.image 
    : `https://recipefinder-99mo.onrender.com/uploads/${recipe.image}`;

  return (
    <div style={styles.card}>
      <Link to={`/details/${recipe._id}`}>
        <img
          src={imageUrl}
          alt={recipe.title}
          style={styles.image}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'https://via.placeholder.com/200'; // Fallback image
          }}
        />
      </Link>
      <div style={styles.details}>
        <Link to={`/details/${recipe._id}`} style={styles.titleLink}>
          <h3 style={styles.title}>{recipe.title}</h3>
        </Link>
        <div style={styles.info}>
          <div style={styles.infoItem}>
            <Clock size={16} style={styles.icon} />
            <span>{recipe.readyInMinutes} min</span>
          </div>
          <div style={styles.infoItem}>
            <Users size={16} style={styles.icon} />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
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
    height: '300px', // Fixed height to prevent shaking
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  details: {
    padding: '12px',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  info: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
    color: '#666',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  icon: {
    color: '#666',
  },
};

export default MyCard;