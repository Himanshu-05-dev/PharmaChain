import * as SecureStore from 'expo-secure-store';

export const SECURE_KEYS = {
  ACCESS_TOKEN: 'shopkeeper_access_token',
  REFRESH_TOKEN: 'shopkeeper_refresh_token',
  SHOPKEEPER_DATA: 'shopkeeper_profile_data',
  LEGACY_TOKEN: 'firebaseIdToken',
  LEGACY_USER: 'userData',
};

export const saveToken = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving secure key: ${key}`, error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error getting secure key: ${key}`, error);
    return null;
  }
};

export const deleteToken = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting secure key: ${key}`, error);
  }
};

export const clearAllAuthData = async () => {
  try {
    await Promise.all([
      deleteToken(SECURE_KEYS.ACCESS_TOKEN),
      deleteToken(SECURE_KEYS.REFRESH_TOKEN),
      deleteToken(SECURE_KEYS.SHOPKEEPER_DATA),
      deleteToken(SECURE_KEYS.LEGACY_TOKEN),
      deleteToken(SECURE_KEYS.LEGACY_USER),
    ]);
  } catch (error) {
    console.error('Error clearing secure auth data', error);
  }
};
