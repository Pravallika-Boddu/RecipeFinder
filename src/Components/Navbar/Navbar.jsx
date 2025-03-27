import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Navbar.css';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import logo from '../../assets/logo.png';
import making from '../../assets/making.jpg';
import vedio from '../../assets/vedio.mp4';
import parota from '../../assets/parota.jpg';
import biryani from '../../assets/biryani.jpg';
import gobi from '../../assets/gobi.jpg';
import pulihora from '../../assets/pulihora.jpg';
import contact from '../../assets/contact.png';

const recipes = [
  {
    name: "Gobi Manchurian",
    img: gobi,
    ingredients: ["Cauliflower", "Corn flour", "Ginger-garlic paste", "Soy sauce", "Chili sauce"],
    prepTime: "30 mins",
    level: "Intermediate"
  },
  {
    name: "Biryani",
    img: biryani,
    ingredients: ["Basmati Rice", "Chicken", "Spices", "Yogurt", "Onions"],
    prepTime: "1 hr",
    level: "Advanced"
  },
  {
    name: "Parota",
    img: parota,
    ingredients: ["Maida", "Egg", "Oil", "Salt", "Water"],
    prepTime: "45 mins",
    level: "Intermediate"
  },
  {
    name: "Pulihora",
    img: pulihora,
    ingredients: ["Rice", "Tamarind", "Green chilies", "Turmeric", "Mustard seeds"],
    prepTime: "20 mins",
    level: "Easy"
  }
];
const Navbar = () => {
  return (
    <div>
      <nav className='container'>
        <img src={logo} alt="" className='logo' />
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/signup">Recipes</Link></li>
          <li className='txt'>
            <Link to="/signup">
              <button className='btn'>Login/Signup</button>
            </Link>
          </li>
        </ul>
      </nav>

      <div className='hero'>
        <div className='leftDiv'>
          <h1>Your ultimate destination for discovering, creating, and sharing delicious recipes tailored to your preferences.</h1>
          <img src={making} alt="" className='making' />
        </div>
        <div className='rightDiv'>
          <video src={vedio} controls className='vedio'></video>
          <h2>Master the <span className='am'>Art of Cooking!</span></h2>
        </div>
      </div>

      <div className='imageScroll'>
        {recipes.map((recipe, index) => (
          <div className='image-container' key={index}>
            <img src={recipe.img} alt={recipe.name} className="recipe-image" />
            <div className="recipe-overlay">
              <h2>{recipe.name}</h2>
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <h4>Preparation Time:</h4>
              <p className='ppp'>{recipe.prepTime}</p>
              <h4>Difficulty Level:</h4>
              <p className='ppp'>{recipe.level}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='imageScroll'>
        <div className='leftDiv'>
          <h2>At Recipe Finder, we aim to make cooking effortless and exciting by helping you discover delicious recipes tailored to your preferences. Whether you're searching by ingredients, exploring new cuisines, or planning meals for the week, our platform ensures you find the perfect dish every time. With an intuitive interface and AI-powered recommendations, we make cooking enjoyable, accessible, and hassle-free for everyone.</h2>
        </div>
        <div className='right'>
          <img src={contact} alt="" className='contact' />
        </div>
      </div>
      <footer className="footer">
      <p>© 2025 Recipe Finder. All Rights Reserved.</p>
      
      <div className="social-icons">
        {/* Facebook */}
        <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="icon facebook" />
        </a>

        {/* Instagram */}
        <a href="https://instagram.com/recipef1nder" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon instagram" />
        </a>

        {/* Twitter */}
        <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon twitter" />
        </a>

        {/* WhatsApp - Direct Chat */}
        <a href="https://wa.me/918328447471" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp className="icon whatsapp" />
        </a>

        {/* Email */}
        <a href="mailto:boddupravallikaa@gmail.com">
          <FaEnvelope className="icon email" />
        </a>
      </div>
    </footer>
    </div>
  );
}

export default Navbar;
