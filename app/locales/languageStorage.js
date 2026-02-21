import * as SecureStore from 'expo-secure-store';

// Keys for SecureStore
const LANGUAGE_KEY = 'app_language';

// Function to get the stored language
export const getStoredLanguage = async () => {
  try {
    const language = await SecureStore.getItemAsync(LANGUAGE_KEY);
    return language || 'es'; // Default to 'en' if no language is set
  } catch (error) {
    console.error('Failed to load language from storage:', error);
    return 'en'; // Default to 'en' if there's an error
  }
};

// Function to save the language to SecureStore
export const saveLanguage = async (language) => {
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language to storage:', error);
  }
};
