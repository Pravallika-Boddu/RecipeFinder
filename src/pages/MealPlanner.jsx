import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Trash2, Save, AlertCircle, Clock, X } from 'lucide-react';
import { fetchRandomRecipes, getMealPlan, saveMealPlan } from '../services/api';
import Navbar from '../OrdinaryUsers/Navbarr';

const MealPlanner = () => {
  const [currentWeek, setCurrentWeek] = useState([
    { day: 'Monday', meals: {} },
    { day: 'Tuesday', meals: {} },
    { day: 'Wednesday', meals: {} },
    { day: 'Thursday', meals: {} },
    { day: 'Friday', meals: {} },
    { day: 'Saturday', meals: {} },
    { day: 'Sunday', meals: {} }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const mealPlan = await getMealPlan(userId);
  
        if (mealPlan && mealPlan.length > 0) {
          console.log("Fetched meal plan:", mealPlan); // Debug log
          const updatedMealPlan = currentWeek.map(day => {
            const savedDay = mealPlan.find(d => d.day === day.day);
            return savedDay ? { ...day, meals: savedDay.meals || {} } : day;
          });
          console.log("Updated meal plan:", updatedMealPlan); // Debug log
          setCurrentWeek(updatedMealPlan);
        }
      } catch (err) {
        setError('Failed to load meal plan. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    loadMealPlan();
  }, []);
  const handleSaveMealPlan = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID is missing. Please log in again.');
      return;
    }
  
    console.log('Saving meal plan:', currentWeek); // Log the data being sent
    console.log('User ID:', userId);
  
    try {
      const response = await saveMealPlan(currentWeek, userId);
      console.log('Save meal plan response:', response); // Log the response
      if (response.data && response.data.message === 'Meal plan saved successfully') {
        alert('Meal plan saved successfully!');
      } else {
        alert('Failed to save meal plan. Please try again.');
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
      alert(`Failed to save meal plan: ${error.message}`);
    }
  };
  const handleAddRecipe = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMeal(mealType);
    loadSuggestedRecipes(mealType);
  };

  const loadSuggestedRecipes = async (mealType) => {
    try {
      setLoadingSuggestions(true);
      const recipes = await fetchRandomRecipes(6, { type: mealType });
      setSuggestedRecipes(recipes || []);
    } catch (err) {
      console.error('Error loading suggested recipes:', err);
      setSuggestedRecipes([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    if (!selectedDay || !selectedMeal) return;

    setCurrentWeek(prev => prev.map(day =>
      day.day === selectedDay ? { ...day, meals: { ...day.meals, [selectedMeal]: recipe } } : day
    ));

    setSelectedDay(null);
    setSelectedMeal(null);
    setSuggestedRecipes([]);
  };

  const handleRemoveRecipe = (day, mealType) => {
    setCurrentWeek(prev => prev.map(d =>
      d.day === day ? { ...d, meals: { ...d.meals, [mealType]: undefined } } : d
    ));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
        <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #10b981' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
            <Calendar size={28} style={{ marginRight: '8px' }} />
            Meal Planner
          </h1>
          <button
            onClick={handleSaveMealPlan}
            style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', backgroundColor: '#10b981', color: '#ffffff', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <Save size={18} style={{ marginRight: '8px' }} />
            Save Plan
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={18} style={{ color: '#10b981', marginRight: '8px' }} />
            <p style={{ color: '#065f46', fontSize: '14px' }}>
              Plan your meals for the week and save them for easy reference. Click the + button to add a recipe to a meal.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#4b5563', width: '25%' }}>Day</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#4b5563', width: '25%' }}>Breakfast</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#4b5563', width: '25%' }}>Lunch</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '500', color: '#4b5563', width: '25%' }}>Dinner</th>
                </tr>
              </thead>
              <tbody>
  {currentWeek.map((dayPlan) => (
    <tr key={dayPlan.day} style={{ borderTop: '1px solid #e5e7eb' }}>
      <td style={{ padding: '16px' }}>
        <div style={{ fontWeight: '500' }}>{dayPlan.day}</div>
      </td>

      {/* Breakfast */}
      <td style={{ padding: '16px' }}>
        {dayPlan.meals?.breakfast ? (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img 
              src={dayPlan.meals.breakfast.image} 
              alt={dayPlan.meals.breakfast.title}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <Link 
                to={`/recipe/${dayPlan.meals.breakfast.id}`}
                style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {dayPlan.meals.breakfast.title}
              </Link>
              <div style={{ display: 'flex', marginTop: '4px' }}>
                <button
                  onClick={() => handleRemoveRecipe(dayPlan.day, 'breakfast')}
                  style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleAddRecipe(dayPlan.day, 'breakfast')}
            style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <Plus size={16} style={{ marginRight: '4px' }} />
            Add Breakfast
          </button>
        )}
      </td>

      {/* Lunch */}
      <td style={{ padding: '16px' }}>
        {dayPlan.meals?.lunch ? (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img 
              src={dayPlan.meals.lunch.image} 
              alt={dayPlan.meals.lunch.title}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <Link 
                to={`/recipe/${dayPlan.meals.lunch.id}`}
                style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {dayPlan.meals.lunch.title}
              </Link>
              <div style={{ display: 'flex', marginTop: '4px' }}>
                <button
                  onClick={() => handleRemoveRecipe(dayPlan.day, 'lunch')}
                  style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleAddRecipe(dayPlan.day, 'lunch')}
            style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <Plus size={16} style={{ marginRight: '4px' }} />
            Add Lunch
          </button>
        )}
      </td>

      {/* Dinner */}
      <td style={{ padding: '16px' }}>
        {dayPlan.meals?.dinner ? (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img 
              src={dayPlan.meals.dinner.image} 
              alt={dayPlan.meals.dinner.title}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', marginRight: '8px' }}
            />
            <div style={{ flex: 1 }}>
              <Link 
                to={`/recipe/${dayPlan.meals.dinner.id}`}
                style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.2s' }}
              >
                {dayPlan.meals.dinner.title}
              </Link>
              <div style={{ display: 'flex', marginTop: '4px' }}>
                <button
                  onClick={() => handleRemoveRecipe(dayPlan.day, 'dinner')}
                  style={{ fontSize: '12px', color: '#ef4444', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleAddRecipe(dayPlan.day, 'dinner')}
            style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            <Plus size={16} style={{ marginRight: '4px' }} />
            Add Dinner
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {selectedDay && selectedMeal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                  Select a {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Recipe
                </h3>
                <button 
                  onClick={() => {
                    setSelectedDay(null);
                    setSelectedMeal(null);
                    setSuggestedRecipes([]);
                  }}
                  style={{ color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: '16px', overflowY: 'auto', maxHeight: '70vh' }}>
                {loadingSuggestions ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '256px' }}>
                    <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #10b981' }}></div>
                  </div>
                ) : suggestedRecipes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <p style={{ color: '#6b7280' }}>No recipes found. Try again later.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {suggestedRecipes.map((recipe) => (
                      <div 
                        key={recipe.id}
                        style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onClick={() => handleSelectRecipe(recipe)}
                      >
                        <img 
                          src={recipe.image} 
                          alt={recipe.title}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '500' }}>{recipe.title}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                            <Clock size={14} style={{ marginRight: '4px' }} />
                            <span>{recipe.readyInMinutes} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;