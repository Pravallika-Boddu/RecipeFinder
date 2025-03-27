import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      profile: 'Profile',
      settings: 'Settings',
      themes: 'Themes',
      fontAppearance: 'Font Appearance',
      languages: 'Languages',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      profile: 'Perfil',
      settings: 'Configuración',
      themes: 'Temas',
      fontAppearance: 'Apariencia de fuente',
      languages: 'Idiomas',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue',
      profile: 'Profil',
      settings: 'Paramètres',
      themes: 'Thèmes',
      fontAppearance: 'Apparence de la police',
      languages: 'Langues',
    },
  },
  de: {
    translation: {
      welcome: 'Willkommen',
      profile: 'Profil',
      settings: 'Einstellungen',
      themes: 'Themen',
      fontAppearance: 'Schriftart',
      languages: 'Sprachen',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;