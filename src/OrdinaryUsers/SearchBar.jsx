import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search recipes or ingredients...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState('recipe');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&type=${searchBy}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ width: '100%', ...(className ? { className } : {}) }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              ':focus': {
                borderColor: '#10b981',
              },
            }}
          />
          <Search 
            style={{ 
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }} 
            size={20} 
          />
        </div>

        {/* Search Options and Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search By Buttons */}
          <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setSearchBy('recipe')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: searchBy === 'recipe' ? '#10b981' : 'white',
                color: searchBy === 'recipe' ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s',
                ':hover': {
                  backgroundColor: searchBy === 'recipe' ? '#0d9c6e' : '#f3f4f6',
                },
              }}
            >
              Recipe Name
            </button>
            <button
              type="button"
              onClick={() => setSearchBy('ingredients')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: searchBy === 'ingredients' ? '#10b981' : 'white',
                color: searchBy === 'ingredients' ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s',
                ':hover': {
                  backgroundColor: searchBy === 'ingredients' ? '#0d9c6e' : '#f3f4f6',
                },
              }}
            >
              Ingredients
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            style={{
              padding: '8px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#0d9c6e',
              },
            }}
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;