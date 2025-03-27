import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './OrdinaryUsers/i18n';
import App from './App.jsx';

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);