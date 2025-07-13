import React, { useEffect, useState } from 'react';
import MyCard from './MyCard'; // Import the RecipeCard component
import Header from './Header';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('Fetching recipes for user ID:', userId);

        if (!userId) {
          setError('User ID not found. Please log in again.');
          return;
        }

        const response = await fetch(`https://recipe-finder-0epm.onrender.com/api/fetch/user/${userId}`);
        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Recipes fetched:', data);
          setRecipes(data);
        } else {
          setError('Failed to fetch recipes.');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('An error occurred while fetching recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.heading}>My Recipes</h1>
        {recipes.length > 0 ? (
          <div style={styles.grid}>
            {recipes.map((recipe) => (
              <MyCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: 'red',
  },
};

export default MyRecipes;