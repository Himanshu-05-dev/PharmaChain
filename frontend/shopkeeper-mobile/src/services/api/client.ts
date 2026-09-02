import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getToken, saveToken, clearAllAuthData, SECURE_KEYS } from '../storage/secureStorage';

const getBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri;
  let host = '10.209.231.191';
  if (hostUri) {
    const extracted = hostUri.split(':')[0];
    if (extracted && extracted !== 'localhost' && extracted !== '127.0.0.1') {
      host = extracted;
    }
  } else if (Platform.OS === 'android') {
    host = '10.0.2.2';
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    let url = process.env.EXPO_PUBLIC_API_URL;
    if (Platform.OS !== 'web' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      url = url.replace(/localhost|127\.0\.0\.1/g, host);
    }
    return url;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2';
  }
  return `http://${host}`;
};

export const API_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = (await getToken(SECURE_KEYS.ACCESS_TOKEN)) || (await getToken(SECURE_KEYS.LEGACY_TOKEN));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Token Refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Do not attempt refresh on auth endpoints like login or refresh itself
      if (
        originalRequest.url?.includes('/api/shopkeeper/login') ||
        originalRequest.url?.includes('/api/shopkeeper/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getToken(SECURE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call backend refresh endpoint using a fresh un-intercepted axios instance
        const response = await axios.post(`${API_URL}/api/shopkeeper/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Refresh response missing new access token');
        }

        await saveToken(SECURE_KEYS.ACCESS_TOKEN, newAccessToken);
        if (response.data?.refreshToken) {
          await saveToken(SECURE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await clearAllAuthData();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
