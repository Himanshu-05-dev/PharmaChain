import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '../../store/authStore';

const getHostIp = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return '192.168.1.9';
};

const hostIp = getHostIp();

const CONSUMER_API_URL =
  process.env.EXPO_PUBLIC_CONSUMER_API_URL ||
  `http://${hostIp}:3003/api/consumer`;

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  `http://${hostIp}:3002/api/v1`;

export const consumerApiClient = axios.create({
  baseURL: CONSUMER_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Interceptor to attach Firebase token if authenticated
apiClient.interceptors.request.use(async (config) => {
  const user = useAuthStore.getState().user;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.warn("Could not get Firebase ID token", e);
    }
  }
  return config;
});

// Sync User to MongoDB via Backend
export const syncUser = async () => {
  try {
    const response = await apiClient.post('/user/sync');
    return response.data;
  } catch (error) {
    console.error("Failed to sync user with backend", error);
    throw error;
  }
};
