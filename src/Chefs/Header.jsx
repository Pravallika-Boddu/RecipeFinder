// Header.js
import React, { useState } from "react";
import logo from '../assets/logo.png';
import { User, Settings, Eye, Languages, HelpCircle, LogOut, Sun, Moon, Type, Plus } from "lucide-react"; // Import icons
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isFontsOpen, setIsFontsOpen] = useState(false);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");
  const [fontStyle, setFontStyle] = useState("sans-serif");
  const [language, setLanguage] = useState("en");

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSettingsOpen(false);
    setIsThemesOpen(false);
    setIsFontsOpen(false);
    setIsLanguagesOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsThemesOpen(false);
    setIsFontsOpen(false);
  };

  const toggleThemes = () => {
    setIsThemesOpen(!isThemesOpen);
  };

  const toggleFonts = () => {
    setIsFontsOpen(!isFontsOpen);
  };

  const toggleLanguages = () => {
    setIsLanguagesOpen(!isLanguagesOpen);
  };

  const handleLogout = () => {
    window.location.href = "/signup";
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  const handleFontSizeChange = (selectedFontSize) => {
    setFontSize(selectedFontSize);
    document.documentElement.style.fontSize =
      selectedFontSize === "small" ? "14px" :
      selectedFontSize === "medium" ? "16px" :
      "18px";
  };

  const handleFontStyleChange = (selectedFontStyle) => {
    setFontStyle(selectedFontStyle);
    document.documentElement.style.fontFamily =
      selectedFontStyle === "sans-serif" ? "Arial, sans-serif" :
      selectedFontStyle === "serif" ? "Georgia, serif" :
      "Courier New, monospace";
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    console.log("Language changed to:", selectedLanguage);
  };

  const handleUploadRecipe = () => {
    navigate("/upload-recipe");
  };

  return (
    <>
      <style>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: var(--header-bg, #fff);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }

          .header-left {
            display: flex;
            align-items: center;
          }

          .logo {
            height: 40px;
            width: auto;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .header-right a {
            text-decoration: none;
            color: var(--text-color, #333);
            font-weight: 500;
          }

          .header-right a:hover {
            color: var(--hover-color, #ff6b6b);
          }

          .profile-icon {
            cursor: pointer;
            position: relative;
          }

          .dropdown {
            position: absolute;
            top: 50px;
            right: 0;
            background-color: var(--dropdown-bg, #fff);
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: ${isDropdownOpen ? "block" : "none"};
            width: 200px;
          }

          .dropdown-item {
            padding: 10px 20px;
            color: var(--text-color, #333);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
          }

          .dropdown-item:hover {
            background-color: var(--hover-bg, #f5f5f5);
          }

          .nested-dropdown {
            padding-left: 20px;
          }

          .nested-dropdown .dropdown-item {
            padding: 8px 20px;
          }

          [data-theme="light"] {
            --header-bg: #fff;
            --text-color: #333;
            --hover-color: #ff6b6b;
            --dropdown-bg: #fff;
            --border-color: #ddd;
            --hover-bg: #f5f5f5;
          }

          [data-theme="dark"] {
            --header-bg: #333;
            --text-color: #fff;
            --hover-color: #ff6b6b;
            --dropdown-bg: #444;
            --border-color: #555;
            --hover-bg: #555;
          }
        `}
      </style>
      <header className="header">
        <div className="header-left">
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />
        </div>
        <div className="header-right">
          <a href="/chef">Home</a>
          <a href="/explore-recipes">Search</a>
          <a href="/saved">Saved Recipes</a>
          <a href="/my-recipes">My Recipes</a>
          <button
            onClick={handleUploadRecipe}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Upload Recipe
          </button>
          <div className="profile-icon">
            <button
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Toggle profile dropdown"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={20} />
            </button>
            {isDropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={toggleSettings}>
                  <Settings size={16} /> Settings
                </div>
                {isSettingsOpen && (
                  <div className="nested-dropdown">
                    <div className="dropdown-item" onClick={toggleThemes}>
                      <Sun size={16} /> Themes
                    </div>
                    {isThemesOpen && (
                      <div className="nested-dropdown">
                        <div className="dropdown-item" onClick={() => handleThemeChange("light")}>
                          Light Theme
                        </div>
                        <div className="dropdown-item" onClick={() => handleThemeChange("dark")}>
                          Dark Theme
                        </div>
                      </div>
                    )}
                    <div className="dropdown-item" onClick={toggleFonts}>
                      <Type size={16} /> Font Sizes
                    </div>
                    {isFontsOpen && (
                      <div className="nested-dropdown">
                        <div className="dropdown-item" onClick={() => handleFontSizeChange("small")}>
                          Small
                        </div>
                        <div className="dropdown-item" onClick={() => handleFontSizeChange("medium")}>
                          Medium
                        </div>
                        <div className="dropdown-item" onClick={() => handleFontSizeChange("large")}>
                          Large
                        </div>
                      </div>
                    )}
                    <div className="dropdown-item" onClick={() => handleFontStyleChange("sans-serif")}>
                      <Type size={16} /> Sans-Serif
                    </div>
                    <div className="dropdown-item" onClick={() => handleFontStyleChange("serif")}>
                      <Type size={16} /> Serif
                    </div>
                    <div className="dropdown-item" onClick={() => handleFontStyleChange("monospace")}>
                      <Type size={16} /> Monospace
                    </div>
                  </div>
                )}
                <a href="/edit-profile" className="dropdown-item">
                  <Eye size={16} /> View Profile
                </a>
                <div className="dropdown-item" onClick={toggleLanguages}>
                  <Languages size={16} /> Languages
                </div>
                {isLanguagesOpen && (
                  <div className="nested-dropdown">
                    <div className="dropdown-item" onClick={() => handleLanguageChange("en")}>
                      English
                    </div>
                    <div className="dropdown-item" onClick={() => handleLanguageChange("es")}>
                      Español
                    </div>
                    <div className="dropdown-item" onClick={() => handleLanguageChange("fr")}>
                      Français
                    </div>
                  </div>
                )}
                <a href="/helppp" className="dropdown-item">
                  <HelpCircle size={16} /> Help
                </a>
                <div className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;