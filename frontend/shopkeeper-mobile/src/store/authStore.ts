import { create } from 'zustand';
import { 
  saveToken, 
  getToken, 
  clearAllAuthData,
  SECURE_KEYS 
} from '../services/storage/secureStorage';
import { Shopkeeper, VerificationStatus, RegistrationForm } from '../types/auth';

export interface User {
  id: string;
  firebaseUid?: string;
  role: string;
  shopId: string;
  status: string;
  email?: string;
  displayName?: string;
}

interface AuthState {
  // Authentication & Verification state
  shopkeeper: Shopkeeper | null;
  user: User | null; // Compatibility alias
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationStatus: VerificationStatus | null;
  
  // Actions
  setShopkeeper: (shopkeeper: Shopkeeper | null) => void;
  setTokens: (accessToken: string | null, refreshToken?: string | null) => Promise<void>;
  login: (accessToken: string, refreshTokenOrUser: string | User, shopkeeperData?: Shopkeeper) => Promise<void>;
  updateShopkeeper: (updates: Partial<Shopkeeper>) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>; // Compatibility
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setVerificationStatus: (status: VerificationStatus) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  shopkeeper: null,
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  verificationStatus: null,

  setShopkeeper: (shopkeeper) => {
    const userCompat: User | null = shopkeeper ? {
      id: shopkeeper.id || shopkeeper.shopId,
      shopId: shopkeeper.shopId,
      role: shopkeeper.role || 'SHOPKEEPER',
      status: shopkeeper.verificationStatus,
      displayName: shopkeeper.shopName || shopkeeper.ownerName,
      email: shopkeeper.shopEmail || shopkeeper.ownerEmail
    } : null;

    set({ 
      shopkeeper, 
      user: userCompat,
      isAuthenticated: !!shopkeeper,
      verificationStatus: shopkeeper?.verificationStatus || null
    });
  },

  setTokens: async (accessToken, refreshToken = null) => {
    if (accessToken) {
      await saveToken(SECURE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      await saveToken(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    set((state) => ({ 
      accessToken: accessToken ?? state.accessToken,
      refreshToken: refreshToken ?? state.refreshToken
    }));
  },

  login: async (accessToken, refreshTokenOrUser, shopkeeperData) => {
    let refreshToken = '';
    let shopkeeper: Shopkeeper;

    if (typeof refreshTokenOrUser === 'string') {
      refreshToken = refreshTokenOrUser;
      shopkeeper = shopkeeperData || {
        shopId: 'SHOP-001',
        shopName: 'My Pharmacy',
        ownerName: 'Shop Owner',
        verificationStatus: 'verified'
      };
    } else {
      // Legacy signature compatibility: login(token, user)
      const user = refreshTokenOrUser;
      refreshToken = 'legacy-refresh-token';
      shopkeeper = {
        id: user.id,
        shopId: user.shopId,
        shopName: user.displayName || 'Pharmacy Store',
        ownerName: user.displayName || 'Owner',
        verificationStatus: (user.status as VerificationStatus) || 'verified',
        role: user.role
      };
    }

    await saveToken(SECURE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      await saveToken(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    await saveToken(SECURE_KEYS.SHOPKEEPER_DATA, JSON.stringify(shopkeeper));

    const userCompat: User = {
      id: shopkeeper.id || shopkeeper.shopId,
      shopId: shopkeeper.shopId,
      role: shopkeeper.role || 'SHOPKEEPER',
      status: shopkeeper.verificationStatus,
      displayName: shopkeeper.shopName || shopkeeper.ownerName,
      email: shopkeeper.shopEmail || shopkeeper.ownerEmail
    };

    set({ 
      accessToken, 
      refreshToken, 
      shopkeeper, 
      user: userCompat,
      isAuthenticated: true, 
      verificationStatus: shopkeeper.verificationStatus,
      isLoading: false
    });
  },

  updateShopkeeper: async (updates) => {
    set((state) => {
      if (!state.shopkeeper) return state;
      const updatedShopkeeper = { ...state.shopkeeper, ...updates };
      saveToken(SECURE_KEYS.SHOPKEEPER_DATA, JSON.stringify(updatedShopkeeper));
      
      const updatedUser: User = {
        id: updatedShopkeeper.id || updatedShopkeeper.shopId,
        shopId: updatedShopkeeper.shopId,
        role: updatedShopkeeper.role || 'SHOPKEEPER',
        status: updatedShopkeeper.verificationStatus,
        displayName: updatedShopkeeper.shopName || updatedShopkeeper.ownerName,
        email: updatedShopkeeper.shopEmail || updatedShopkeeper.ownerEmail
      };

      return { 
        shopkeeper: updatedShopkeeper,
        user: updatedUser,
        verificationStatus: updatedShopkeeper.verificationStatus
      };
    });
  },

  updateUser: async (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      saveToken(SECURE_KEYS.LEGACY_USER, JSON.stringify(updatedUser));
      
      let updatedShopkeeper = state.shopkeeper;
      if (updatedShopkeeper && updates.displayName) {
        updatedShopkeeper = { ...updatedShopkeeper, shopName: updates.displayName };
        saveToken(SECURE_KEYS.SHOPKEEPER_DATA, JSON.stringify(updatedShopkeeper));
      }

      return { user: updatedUser, shopkeeper: updatedShopkeeper };
    });
  },

  logout: async () => {
    await clearAllAuthData();
    set({ 
      shopkeeper: null, 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false, 
      verificationStatus: null,
      isLoading: false
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const accessToken = (await getToken(SECURE_KEYS.ACCESS_TOKEN)) || (await getToken(SECURE_KEYS.LEGACY_TOKEN));
      const refreshToken = await getToken(SECURE_KEYS.REFRESH_TOKEN);
      const shopkeeperDataStr = (await getToken(SECURE_KEYS.SHOPKEEPER_DATA)) || (await getToken(SECURE_KEYS.LEGACY_USER));
      
      if (accessToken && shopkeeperDataStr) {
        try {
          const parsed = JSON.parse(shopkeeperDataStr);
          let shopkeeper: Shopkeeper;
          
          if (parsed.shopName || parsed.verificationStatus) {
            shopkeeper = parsed as Shopkeeper;
          } else {
            // Legacy user object
            shopkeeper = {
              id: parsed.id,
              shopId: parsed.shopId || 'SHOP-001',
              shopName: parsed.displayName || 'My Pharmacy',
              ownerName: parsed.displayName || 'Owner',
              verificationStatus: (parsed.status as VerificationStatus) || 'verified',
              role: parsed.role || 'SHOPKEEPER'
            };
          }

          const userCompat: User = {
            id: shopkeeper.id || shopkeeper.shopId,
            shopId: shopkeeper.shopId,
            role: shopkeeper.role || 'SHOPKEEPER',
            status: shopkeeper.verificationStatus,
            displayName: shopkeeper.shopName || shopkeeper.ownerName,
            email: shopkeeper.shopEmail || shopkeeper.ownerEmail
          };

          set({ 
            accessToken, 
            refreshToken, 
            shopkeeper, 
            user: userCompat,
            isAuthenticated: true, 
            verificationStatus: shopkeeper.verificationStatus,
            isLoading: false 
          });
          return;
        } catch (e) {
          console.error('Failed to parse stored shopkeeper data', e);
        }
      }
    } catch (err) {
      console.error('Error during checkAuth', err);
    }

    set({ 
      shopkeeper: null, 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false, 
      verificationStatus: null,
      isLoading: false 
    });
  },

  setVerificationStatus: (status: VerificationStatus) => {
    set((state) => {
      const updatedShopkeeper = state.shopkeeper ? { ...state.shopkeeper, verificationStatus: status } : null;
      if (updatedShopkeeper) {
        saveToken(SECURE_KEYS.SHOPKEEPER_DATA, JSON.stringify(updatedShopkeeper));
      }
      return { 
        verificationStatus: status,
        shopkeeper: updatedShopkeeper
      };
    });
  }
}));
