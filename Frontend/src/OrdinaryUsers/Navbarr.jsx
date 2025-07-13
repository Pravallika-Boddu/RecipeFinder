import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, Heart, Menu, X, User, LogOut, History, Lock, HelpCircle, Globe } from 'lucide-react';
import logo from '../assets/logo.png'; // Import your logo image
import ProfileDropdown from './ProfileDropdown'; // Import the ProfileDropdown component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{ 
      width: '100%', 
      padding: '0', 
      paddingTop: '5px', 
      backgroundColor: '#ffffff', 
      color: '#333333', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px', 
        paddingTop: '12px', 
        paddingBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo on the left */}
        <Link
          to="/normal"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#059669',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
            marginLeft: '10px'
          }}
        >
          <img
            src={logo}
            alt="RecipeFinder Logo"
            style={{
              width: '150px',
              borderRadius: '50px',
              marginRight: '10px'
            }}
          />
        </Link>

        {/* Desktop Navigation - Aligned to the right */}
        <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '24px' }}>
          <Link 
            to="/normal" 
            style={{ 
              color: '#333333', 
              textDecoration: 'none', 
              transition: 'color 0.2s', 
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#059669'}
            onMouseLeave={(e) => e.target.style.color = '#333333'}
          >
            Home
          </Link>
          <Link 
            to="/saved-recipes" 
            style={{ 
              color: '#333333', 
              textDecoration: 'none', 
              transition: 'color 0.2s', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#059669'}
            onMouseLeave={(e) => e.target.style.color = '#333333'}
          >
            <Heart size={18} style={{ marginRight: '4px', color: '#059669' }} />
            Saved Recipes
          </Link>
          <Link 
            to="/meal-planner" 
            style={{ 
              color: '#333333', 
              textDecoration: 'none', 
              transition: 'color 0.2s', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#059669'}
            onMouseLeave={(e) => e.target.style.color = '#333333'}
          >
            <Calendar size={18} style={{ marginRight: '4px', color: '#059669' }} />
            Meal Planner
          </Link>
          <Link 
            to="/search" 
            style={{ 
              color: '#333333', 
              textDecoration: 'none', 
              transition: 'color 0.2s', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 12px',
              borderRadius: '4px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.color = '#059669'}
            onMouseLeave={(e) => e.target.style.color = '#333333'}
          >
            <Search size={18} style={{ marginRight: '4px', color: '#059669' }} />
            Search
          </Link>
          <div>
        <Link 
          to="/chefs-recipes" 
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#04855b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
        >
          Explore Chef's Recipes
        </Link>
      </div>

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Add a media query for responsiveness */}
      <style>
        {`
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .mobile-menu-button {
              display: none !important;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;