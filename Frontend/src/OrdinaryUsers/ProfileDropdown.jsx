import React, { useState } from 'react';
import { ChevronDown, User, Settings, Moon, Type, Globe, LogOut, HelpCircle } from 'lucide-react'; // Added HelpCircle icon
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSettingsDropdown = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleLanguageDropdown = () => setIsLanguageOpen(!isLanguageOpen);
  const toggleThemeDropdown = () => setIsThemeOpen(!isThemeOpen);
  const toggleFontDropdown = () => setIsFontOpen(!isFontOpen);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language); // This will change the language globally
    setIsLanguageOpen(false);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    setIsThemeOpen(false);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.style.fontSize = size;
  };

  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    document.documentElement.style.fontFamily = family;
  };

  const handleLogout = () => {
    // Perform logout operations here (e.g., clear tokens, user data, etc.)
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Round Profile Symbol */}
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '8px',
            minWidth: '200px',
            zIndex: 50,
          }}
        >
          {/* View Profile Link */}
          <Link
            to="/view-profile"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              textDecoration: 'none',
              color: 'inherit',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <User size={16} style={{ marginRight: '8px' }} />
            {t('viewProfile')}
          </Link>

          {/* Help Link */}
          <Link
            to="/help" // Link to the HelpSection component
            onClick={() => setIsOpen(false)}
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              textDecoration: 'none',
              color: 'inherit',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <HelpCircle size={16} style={{ marginRight: '8px' }} /> {/* Added HelpCircle icon */}
            {t('help')}
          </Link>

          {/* Settings Dropdown */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={toggleSettingsDropdown}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <Settings size={16} style={{ marginRight: '8px' }} />
            {t('settings')}
            <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
          </div>

          {isSettingsOpen && (
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                zIndex: 100,
              }}
            >
              {/* Themes Dropdown */}
              <div
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={toggleThemeDropdown}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                <Moon size={16} style={{ marginRight: '8px' }} />
                {t('themes')}
                <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
              </div>

              {isThemeOpen && (
                <div
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleThemeChange('light')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('lightTheme')}
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleThemeChange('dark')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('darkTheme')}
                  </div>
                </div>
              )}

              {/* Font Appearance Dropdown */}
              <div
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={toggleFontDropdown}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                <Type size={16} style={{ marginRight: '8px' }} />
                {t('fontAppearance')}
                <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
              </div>

              {isFontOpen && (
                <div
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    zIndex: 100,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleFontSizeChange('16px')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('fontSize')}: Small
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleFontSizeChange('20px')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('fontSize')}: Medium
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleFontSizeChange('24px')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('fontSize')}: Large
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleFontFamilyChange('Arial')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('fontFamily')}: Arial
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleFontFamilyChange('Times New Roman')}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  >
                    {t('fontFamily')}: Times New Roman
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Languages Dropdown */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={toggleLanguageDropdown}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <Globe size={16} style={{ marginRight: '8px' }} />
            {t('languages')}
            <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
          </div>

          {isLanguageOpen && (
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleLanguageChange('en')}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                English
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleLanguageChange('es')}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                Español
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleLanguageChange('fr')}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                Français
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => handleLanguageChange('de')}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                Deutsch
              </div>
            </div>
          )}

          {/* Logout */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            <LogOut size={16} style={{ marginRight: '8px' }} />
            {t('logout')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;