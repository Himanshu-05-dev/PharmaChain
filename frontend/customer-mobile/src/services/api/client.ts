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
  return '10.209.231.191';
};

const hostIp = getHostIp();

const resolveApiUrl = (envUrl: string | undefined, defaultPath: string) => {
  if (envUrl) {
    // If running on a physical device / mobile, replace localhost/127.0.0.1 with host LAN IP
    if (Platform.OS !== 'web' && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return envUrl.replace(/localhost|127\.0\.0\.1/g, hostIp);
    }
    return envUrl;
  }
  return `http://${hostIp}${defaultPath}`;
};

const CONSUMER_API_URL = resolveApiUrl(
  process.env.EXPO_PUBLIC_CONSUMER_API_URL,
  '/api/consumer'
);

const API_URL = resolveApiUrl(
  process.env.EXPO_PUBLIC_API_URL,
  '/api/v1'
);

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
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auth Interceptor ──────────────────────────────────────────────────────────
// Attach the PharmaChain JWT (not a Firebase token) to every apiClient request.
apiClient.interceptors.request.use((config) => {
  const { pharmaToken } = useAuthStore.getState();
  if (pharmaToken) {
    config.headers.Authorization = `Bearer ${pharmaToken}`;
  }
  return config;
});

// ── Sync User ─────────────────────────────────────────────────────────────────
export const syncUser = async () => {
  try {
    const response = await apiClient.post('/user/sync');
    return response.data;
  } catch (error) {
    console.error('Failed to sync user with backend', error);
    throw error;
  }
};
