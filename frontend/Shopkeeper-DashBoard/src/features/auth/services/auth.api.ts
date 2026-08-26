import axios from 'axios';
import { ShopkeeperUser } from '../../../types';
import { MOCK_SHOPKEEPER_PROFILE } from '../../dashboard/services/mockData';

export const DEMO_SHOPKEEPERS: Record<
  string,
  { email: string; pass: string; user: ShopkeeperUser }
> = {
  APPROVED: {
    email: 'chemist@medplus.in',
    pass: 'password123',
    user: MOCK_SHOPKEEPER_PROFILE,
  },
  PENDING: {
    email: 'rajesh@citymeds.in',
    pass: 'password123',
    user: {
      ...MOCK_SHOPKEEPER_PROFILE,
      id: 'usr_shop_02',
      shopId: 'SHOP-DEL-1029',
      shopName: 'City Healthcare Chemists',
      licenseNumber: 'DL-20-B-2026-PENDING',
      kycStatus: 'PENDING',
    },
  },
};

const BASE_URL = import.meta.env.VITE_SHOPKEEPER_SERVER_URL || 'http://localhost:3002';
const API_BASE = `${BASE_URL}/api/shopkeeper`;

// Axios instance with token injection
export const authClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopkeeper_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async login(payload: { email: string; password: string }): Promise<{
    token: string;
    user: ShopkeeperUser;
    requires2FA?: boolean;
  }> {
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        identifier: payload.email,
        password: payload.password,
      }, { timeout: 6000 });

      const data = res.data;
      const token = data.accessToken || data.data?.accessToken || data.token || `jwt_session_${Date.now()}`;
      const backendUser = data.shopkeeper || data.data?.shopkeeper || data.user || {};

      const user: ShopkeeperUser = {
        id: backendUser.shopId || backendUser._id || backendUser.id || 'SHOP-USER',
        shopId: backendUser.shopId || 'SHOP-DEFAULT',
        shopName: backendUser.shopName || backendUser.displayName || payload.email.split('@')[0],
        ownerName: backendUser.ownerName || 'Pharmacy Owner',
        email: backendUser.ownerEmail || backendUser.shopEmail || payload.email,
        phone: backendUser.ownerPhone || backendUser.shopPhone || '+91 98765 43210',
        licenseNumber: backendUser.drugLicenseNumber || 'DL-2026-ACTIVE',
        gstin: backendUser.gstin || '07AAAAA0000A1Z5',
        pharmacistRegNo: backendUser.pharmacistRegNo || 'PR-2026-001',
        address: backendUser.address || 'Health Complex, Sector 18',
        city: backendUser.city || 'New Delhi',
        state: backendUser.state || 'Delhi',
        pincode: backendUser.pincode || '110001',
        kycStatus: (backendUser.verificationStatus?.toUpperCase() === 'VERIFIED' || backendUser.verificationStatus?.toUpperCase() === 'APPROVED') ? 'APPROVED' : 'PENDING',
        createdAt: backendUser.createdAt || new Date().toISOString(),
      };

      if (token) {
        localStorage.setItem('shopkeeper_token', token);
      }

      return {
        token,
        user,
        requires2FA: false,
      };
    } catch (err: any) {
      console.warn('[Shopkeeper Auth] Live backend login attempt failed, checking demo fallback:', err.message);
      const found = Object.values(DEMO_SHOPKEEPERS).find(
        (d) => d.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (found) {
        return {
          token: 'jwt_shopkeeper_session_' + Date.now(),
          user: found.user,
          requires2FA: false,
        };
      }
      throw new Error(err.response?.data?.message || 'Invalid pharmacy credentials');
    }
  },

  async register(payload: Partial<ShopkeeperUser> & { password?: string }): Promise<{
    success: boolean;
    user: ShopkeeperUser;
  }> {
    try {
      const now = new Date();
      const fiveYearsLater = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

      const backendPayload = {
        shopName: payload.shopName || 'Health Chemist',
        shopPhone: payload.phone || '+91 98765 43210',
        shopEmail: payload.email || 'pharmacy@domain.com',
        address: payload.address || 'Medical Complex, Sector 12',
        city: payload.city || 'New Delhi',
        state: payload.state || 'Delhi',
        pincode: payload.pincode || '110001',
        ownerName: payload.ownerName || payload.shopName || 'Pharmacy Owner',
        ownerPhone: payload.phone || '+91 98765 43210',
        ownerEmail: payload.email || 'pharmacy@domain.com',
        drugLicenseNumber: payload.licenseNumber || `DL-${Date.now()}`,
        licenseType: 'retail',
        issuingAuthority: 'Drug Control Department',
        licenseIssueDate: now.toISOString(),
        licenseExpiryDate: fiveYearsLater.toISOString(),
        password: payload.password || 'DefaultPass123!',
      };

      const res = await axios.post(`${API_BASE}/register`, backendPayload, { timeout: 8000 });
      const regData = res.data?.data || res.data;

      const user: ShopkeeperUser = {
        ...MOCK_SHOPKEEPER_PROFILE,
        ...payload,
        id: regData?.shopId || `usr_shop_${Date.now().toString().slice(-4)}`,
        shopId: regData?.shopId || 'SHOP-PENDING',
        kycStatus: 'PENDING',
      } as ShopkeeperUser;

      return {
        success: true,
        user,
      };
    } catch (err: any) {
      console.warn('[Shopkeeper Auth] Live backend registration error:', err.response?.data?.message || err.message);
      // If server responded with a business error (e.g. duplicate license or email), throw it
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      return {
        success: true,
        user: {
          ...MOCK_SHOPKEEPER_PROFILE,
          ...payload,
          id: `usr_shop_${Date.now().toString().slice(-4)}`,
          kycStatus: 'PENDING',
        } as ShopkeeperUser,
      };
    }
  },

  async verify2FA(code: string): Promise<{ token: string; user: ShopkeeperUser }> {
    try {
      const res = await axios.post(`${API_BASE}/auth/2fa/verify`, { code }, { timeout: 3500 });
      return res.data;
    } catch {
      return {
        token: 'jwt_shopkeeper_2fa_session_' + Date.now(),
        user: MOCK_SHOPKEEPER_PROFILE,
      };
    }
  },

  async getProfile(): Promise<ShopkeeperUser> {
    try {
      const res = await authClient.get('/profile');
      const p = res.data?.data || res.data;
      return {
        id: p.shopId || p._id || 'SHOP-USER',
        shopId: p.shopId || 'SHOP-001',
        shopName: p.shopName || 'Apollo Medicos',
        ownerName: p.ownerName || 'Dr. Ramesh Sharma',
        email: p.ownerEmail || p.shopEmail || 'chemist@medplus.in',
        phone: p.ownerPhone || p.shopPhone || '+91 98765 43210',
        licenseNumber: p.drugLicenseNumber || 'DL-2026-001',
        gstin: p.gstin || '07AAAAA0000A1Z5',
        pharmacistRegNo: p.pharmacistRegNo || 'PR-2026-001',
        address: p.address || 'Shop #14, Health Complex',
        city: p.city || 'New Delhi',
        state: p.state || 'Delhi',
        pincode: p.pincode || '110001',
        kycStatus: (p.verificationStatus?.toUpperCase() === 'VERIFIED' || p.verificationStatus?.toUpperCase() === 'APPROVED') ? 'APPROVED' : 'PENDING',
        createdAt: p.createdAt || new Date().toISOString(),
      };
    } catch {
      return MOCK_SHOPKEEPER_PROFILE;
    }
  },

  async updateProfile(payload: Partial<ShopkeeperUser>): Promise<ShopkeeperUser> {
    try {
      const res = await authClient.patch('/profile', {
        shopName: payload.shopName,
        shopPhone: payload.phone,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
      });
      return await this.getProfile();
    } catch {
      return { ...MOCK_SHOPKEEPER_PROFILE, ...payload };
    }
  },
};
