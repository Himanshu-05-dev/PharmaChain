import { apiClient } from './client';

/**
 * 1. Get Live Inventory
 * GET /api/shopkeeper/inventory
 */
export const getInventory = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await apiClient.get('/api/shopkeeper/inventory', { params });
  return response.data;
};

/**
 * 2. Get Dashboard Stats
 * GET /api/shopkeeper/stats
 */
export const getStats = async () => {
  const response = await apiClient.get('/api/shopkeeper/stats');
  return response.data;
};

/**
 * 3. Get Scanned Medicine History
 * GET /api/shopkeeper/medicine/history
 */
export const getHistory = async (params?: { page?: number; limit?: number; status?: string }) => {
  const response = await apiClient.get('/api/shopkeeper/medicine/history', { params });
  return response.data;
};

/**
 * 4. Get Pharmacy Profile
 * GET /api/shopkeeper/profile
 */
export const getProfile = async () => {
  const response = await apiClient.get('/api/shopkeeper/profile');
  return response.data;
};

/**
 * 5. Update Pharmacy Profile
 * PATCH /api/shopkeeper/profile
 */
export const updateProfile = async (payload: {
  shopName?: string;
  shopPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) => {
  const response = await apiClient.patch('/api/shopkeeper/profile', payload);
  return response.data;
};
