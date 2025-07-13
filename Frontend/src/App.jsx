import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Navbar/Login';
import Signup from './Components/Navbar/Signup';
import AboutUs from './Components/Navbar/AboutUs';
import Recipes from './Components/Navbar/Recipes';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import SavedRecipes from './pages/SavedRecipes';
import MealPlanner from './pages/MealPlanner';
import SearchResults from './pages/SearchResults';
import ViewProfile from './OrdinaryUsers/ViewProfile';
import HomePage from './Chefs/Homepage';
import RecipeExplorer from './Chefs/RecipeExplorer';
import Recipe from './Chefs/RecipeDetail';
import CuisineExplorer from './Chefs/CuisineExplorer';
import Saved from './Chefs/SavedRecipes';
import View from './Chefs/ViewProfile';
import Help from './OrdinaryUsers/Help';
import Helppp from './Chefs/Help';
import UploadRecipe from './Chefs/UploadRecipe';
import MyRecipes from './Chefs/MyRecipes';
import MyDetails from './Chefs/MyDetails';
import ChefRecipes from './OrdinaryUsers/ChefRecipes';
import Details from './OrdinaryUsers/Details';
const App = () => {
  return (
    <div>
    <Router>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/normal" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/search" element={<SearchResults />} />
          <Route path="/recipes/:userType" element={<Recipes />} />
          <Route path="/view-profile" element={<ViewProfile />} />
         <Route path='/chef' element={<HomePage/>}/>
         <Route path="/explore-recipes" element={<RecipeExplorer />} />
         <Route path="/recipech/:id" element={<Recipe/>}/>
         <Route path="/explore-recipes/:cuisine" element={<CuisineExplorer/>} />
         <Route path="/saved" element={<Saved/>} />
         <Route path="/edit-profile" element = {<View />}/>
         <Route path='/help' element={<Help/>}/>
         <Route path='/helppp' element={<Helppp/>}/>
         <Route path="/upload-recipe" element={<UploadRecipe />} />
         <Route path='/my-recipes' element={<MyRecipes/>}/>
         <Route path="/details/:recipeId" element={<MyDetails />} />
         <Route path='/chefs-recipes' element={<ChefRecipes/>}/>
         <Route path='/chef-details/:id' element={<Details/>}/>
        </Routes>
    </Router>
    </div>
  );
};

export default App;
