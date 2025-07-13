import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const UploadRecipe = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [readyInMinutes, setReadyInMinutes] = useState('');
  const [servings, setServings] = useState('');
  const [summary, setSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [extendedIngredients, setExtendedIngredients] = useState([{ id: 1, name: '', amount: '', unit: '', original: '' }]);
  const [diets, setDiets] = useState([]);
  const [dishTypes, setDishTypes] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setExtendedIngredients([...extendedIngredients, { id: extendedIngredients.length + 1, name: '', amount: '', unit: '', original: '' }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set image as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !image || !readyInMinutes || !servings || !summary || !instructions) {
      alert('Please fill out all required fields.');
      return;
    }

    // Validate extendedIngredients
    if (extendedIngredients.length === 0 || extendedIngredients.some(ingredient => !ingredient.name || !ingredient.amount || !ingredient.unit || !ingredient.original)) {
      alert('Please add at least one ingredient with all fields filled.');
      return;
    }

    // Prepare the recipe data
    const recipeData = {
      title,
      image, // Ensure this is a string (URL or base64)
      readyInMinutes: parseInt(readyInMinutes),
      servings: parseInt(servings),
      summary,
      instructions,
      extendedIngredients,
      diets,
      dishTypes,
      cuisines,
      userId: localStorage.getItem('userId'), // Retrieve userId from local storage
    };

    try {
      const response = await fetch('https://recipe-finder-0epm.onrender.com/api/recipes/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include the token for authentication
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Recipe uploaded successfully:', data);
        navigate('/chef'); // Redirect to home or another page
      } else {
        const errorData = await response.json();
        console.error('Failed to upload recipe:', errorData);
        alert(`Failed to upload recipe: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert('An error occurred while uploading the recipe. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Upload Recipe</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ready In Minutes</label>
            <input
              type="number"
              value={readyInMinutes}
              onChange={(e) => setReadyInMinutes(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Servings</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ingredients</label>
            {extendedIngredients.map((ingredient, index) => (
              <div key={ingredient.id} style={styles.ingredientGroup}>
                <input
                  type="text"
                  placeholder="Name"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...extendedIngredients];
                    newIngredients[index].name = e.target.value;
                    setExtendedIngredients(newIngredients);
                  }}
                  style={styles.ingredientInput}
                  required
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...extendedIngredients];
                    newIngredients[index].amount = e.target.value;
                    setExtendedIngredients(newIngredients);
                  }}
                  style={styles.ingredientInput}
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = [...extendedIngredients];
                    newIngredients[index].unit = e.target.value;
                    setExtendedIngredients(newIngredients);
                  }}
                  style={styles.ingredientInput}
                  required
                />
                <input
                  type="text"
                  placeholder="Original"
                  value={ingredient.original}
                  onChange={(e) => {
                    const newIngredients = [...extendedIngredients];
                    newIngredients[index].original = e.target.value;
                    setExtendedIngredients(newIngredients);
                  }}
                  style={styles.ingredientInput}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddIngredient} style={styles.addButton}>
              Add Ingredient
            </button>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Diets</label>
            <input
              type="text"
              value={diets.join(', ')}
              onChange={(e) => setDiets(e.target.value.split(',').map(d => d.trim()))}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dish Types</label>
            <input
              type="text"
              value={dishTypes.join(', ')}
              onChange={(e) => setDishTypes(e.target.value.split(',').map(d => d.trim()))}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cuisines</label>
            <input
              type="text"
              value={cuisines.join(', ')}
              onChange={(e) => setCuisines(e.target.value.split(',').map(c => c.trim()))}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Upload Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    minHeight: '100px',
  },
  ingredientGroup: {
    display: 'flex',
    gap: '10px',
  },
  ingredientInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    flex: '1',
  },
  addButton: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#fff',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#10b981',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default UploadRecipe;