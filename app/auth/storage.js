import * as SecureStore from 'expo-secure-store';

const key = "authToken";

const storeToken = async (authData) => {
  try {
    const jsonValue = JSON.stringify(authData);
    await SecureStore.setItemAsync(key, jsonValue);
    console.log('Auth data stored successfully:', jsonValue);
  } catch (error) {
    console.log('Error storing auth data', error);
  }
};

const getToken = async () => {
  try {
    const tokenData = await SecureStore.getItemAsync(key);
    if (!tokenData) return null;

    const parsedTokenData = JSON.parse(tokenData);
    return parsedTokenData; 

  } catch (error) {
    console.log('Error getting the auth token', error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log('Auth token removed successfully');
  } catch (error) {
    console.log('Error removing auth token', error);
  }
};

const updateToken = async (newTokenData) => {
  try {
    const existingTokenData = await getToken();
    if (!existingTokenData) {
      console.log("No existing token data found.");
      return;
    }

    const updatedTokenData = { ...existingTokenData, ...newTokenData };
    await storeToken(updatedTokenData);
    console.log("Token updated successfully:", updatedTokenData);
  } catch (error) {
    console.log("Error updating token:", error);
  }
};

export default { getToken, removeToken, storeToken, updateToken };
