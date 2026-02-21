import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import { getStoredLanguage, saveLanguage } from './app/locales/languageStorage'; // Adjust the import path

// Import your JSON files for different languages
import en from './app/locales/en.json';
import es from './app/locales/es.json';

export const languageResources = {
  en: { translation: en },
  es: { translation: es },
};

// Function to initialize i18next with the stored language
const initializeI18next = async () => {
  const storedLanguage = await getStoredLanguage(); // Get the stored language

  i18next
    .use(RNLanguageDetector) // Use the language detector
    .use(initReactI18next) // Pass the i18n instance to react-i18next
    .init({
      lng: storedLanguage, // Set the initial language
      fallbackLng: 'es', // Fallback language if the detected language is not available
      supportedLngs: ['en', 'es'], // List of supported languages
      resources: languageResources, // Resource bundle for different languages
      compatibilityJSON: 'v3', // Ensure compatibility mode is set

      interpolation: {
        escapeValue: false, // React already protects from XSS
      },
    });

  // Listen for language changes and save the new language
  i18next.on('languageChanged', (lng) => {
    saveLanguage(lng);
  });
};

// Initialize i18next
initializeI18next();

export default i18next;
