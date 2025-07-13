import React from "react";
import './AboutUs.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
const AboutUs = () =>{
    return(
        <div>
        <div>
      <nav className='container'>
        <img src={logo} alt="" className='logo' />
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>About us</li>
          <li><Link to="/signup">Recipes</Link></li>
          <li className='txt'>
            <Link to="/signup">
              <button className='btn'>Login/Signup</button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div className="about-us-container">
      {/* Header Section */}
      <div className="about-us-header">
        <h1 className="about-us-title">About Recipe Finder</h1>
        <p className="about-us-subtitle">Discover, Save, and Share Recipes with Ease!</p>
      </div>

      {/* Company's Journey Section */}
      <div className="about-us-section">
        <h2 className="about-us-section-title">Our Journey</h2>
        <p className="about-us-section-text">
          At Recipe Finder, our journey began with a simple yet powerful goal: to revolutionize the way people discover and enjoy cooking. Founded by a passionate group of food enthusiasts and tech aficionados, we recognized the challenges many home cooks face when searching for recipes that fit their pantry ingredients. Harnessing the power of artificial intelligence, we set out to create a platform that is not only user-friendly but also highly functional. With each line of code and every added feature, our commitment to making meal planning enjoyable and stress-free has only strengthened.
        </p>
      </div>

      {/* Purpose and Goals Section */}
      <div className="about-us-section">
        <h2 className="about-us-section-title">Purpose and Goals</h2>
        <ul className="about-us-list">
          <li>To inspire users to experiment with new recipes from around the world.</li>
          <li>To foster a community where sharing and discovering recipes is seamless and enjoyable.</li>
          <li>To continually enhance our platform with innovative features that make meal planning and cooking easier.</li>
        </ul>
      </div>

      {/* Offerings Section */}
      <div className="about-us-section">
        <h2 className="about-us-section-title">Our Offerings</h2>
        <ul className="about-us-list">
          <li><strong>Ingredient-Based Recipe Search:</strong> Input ingredients and get tailored recipes.</li>
          <li><strong>Recipe Discovery:</strong> Explore diverse recipes backed by AI recommendations.</li>
          <li><strong>Recipe Details & Instructions:</strong> Step-by-step cooking instructions, ingredient lists, and nutrition info.</li>
          <li><strong>Recipe Saving:</strong> Save your favorite recipes for quick access.</li>
          <li><strong>Recipe Sharing:</strong> Share and explore new culinary ideas.</li>
          <li><strong>Meal Planning Assistance:</strong> Plan meals efficiently with our structured planner.</li>
          <li><strong>Seamless Spoonacular API Integration:</strong> Access real-time recipe data, cooking tips, and nutrition facts.</li>
        </ul>
      </div>

      {/* Call to Action Section */}
      <div className="about-us-cta">
        <h2 className="about-us-cta-title">Join Us in the Culinary Adventure!</h2>
        <p className="about-us-cta-text">
          Whether you're an experienced chef or a kitchen novice, Recipe Finder is here to help you discover, save, and share recipes with ease.
        </p>
        <button className="about-us-button" onClick={() => (window.location.href = "/signup")}>
  Explore Recipes
</button>

      </div>
    </div>
    </div>
  );
};

export default AboutUs;