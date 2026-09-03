import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthViewMode, KYCStatus } from '../types/auth.types';
import { ManufacturerProfile } from '../../../types';

const isValidJwt = (token: string | null): boolean => {
  return (
    !!token &&
    token !== 'pending_token' &&
    token !== 'session-token' &&
    token.split('.').length === 3
  );
};

// Safe localStorage loader for persistent sessions
const loadInitialAuthState = (): {
  token: string | null;
  user: ManufacturerProfile | null;
  isAuthenticated: boolean;
  kycStatus: KYCStatus;
} => {
  if (typeof window === 'undefined') {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      kycStatus: 'PENDING',
    };
  }

  try {
    const storedToken = localStorage.getItem('pharma_token');
    const storedUser = localStorage.getItem('pharma_user');
    if (storedToken && storedUser && isValidJwt(storedToken)) {
      const parsedUser = JSON.parse(storedUser) as ManufacturerProfile;
      return {
        token: storedToken,
        user: parsedUser,
        isAuthenticated: true,
        kycStatus: parsedUser.kycStatus || 'APPROVED',
      };
    }
  } catch (e) {
    // Ignore storage parsing error
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
    kycStatus: 'PENDING',
  };
};

const initialSession = loadInitialAuthState();

const initialState: AuthState = {
  isAuthenticated: initialSession.isAuthenticated,
  user: initialSession.user,
  token: initialSession.token,
  kycStatus: initialSession.kycStatus,
  authView: initialSession.isAuthenticated ? 'login' : 'landing',
  requires2FA: false,
  pendingLoginEmail: null,
  loading: false,
  error: null,
  blockedReason: undefined,
  blockedAt: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthView(state, action: PayloadAction<AuthViewMode>) {
      state.authView = action.payload;
      state.error = null;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setPendingLoginEmail(state, action: PayloadAction<string | null>) {
      state.pendingLoginEmail = action.payload;
      state.requires2FA = !!action.payload;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; manufacturer: ManufacturerProfile; rememberMe?: boolean }>
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.manufacturer;
      state.kycStatus = action.payload.manufacturer.kycStatus || 'APPROVED';
      state.requires2FA = false;
      state.pendingLoginEmail = null;
      state.loading = false;
      state.error = null;

      try {
        localStorage.setItem('pharma_token', action.payload.token);
        localStorage.setItem('pharma_user', JSON.stringify(action.payload.manufacturer));
      } catch (e) {
        // ignore storage errors
      }
    },
    registerSuccess(
      state,
      action: PayloadAction<{ token: string; manufacturer: ManufacturerProfile }>
    ) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = action.payload.manufacturer;
      state.kycStatus = 'PENDING';
      state.loading = false;
      state.error = null;
      state.authView = 'pending-kyc';

      try {
        localStorage.removeItem('pharma_token');
        localStorage.setItem('pharma_user', JSON.stringify(action.payload.manufacturer));
      } catch (e) {
        // ignore
      }
    },
    setKYCStatus(state, action: PayloadAction<KYCStatus>) {
      state.kycStatus = action.payload;
      if (action.payload === 'APPROVED') {
        state.blockedReason = undefined;
        state.blockedAt = undefined;
      }
      if (state.user) {
        state.user.kycStatus = action.payload;
        if (action.payload === 'APPROVED') {
          state.user.blockedReason = undefined;
          state.user.blockedAt = undefined;
        }
        try {
          localStorage.setItem('pharma_user', JSON.stringify(state.user));
        } catch (e) {
          // ignore
        }
      }
    },
    // Explicit unblock action: restores session state to APPROVED
    setUnblocked(state) {
      state.kycStatus = 'APPROVED';
      state.blockedReason = undefined;
      state.blockedAt = undefined;
      if (state.user) {
        state.user.kycStatus = 'APPROVED';
        state.user.blockedReason = undefined;
        state.user.blockedAt = undefined;
        try {
          localStorage.setItem('pharma_user', JSON.stringify(state.user));
        } catch (e) {
          // ignore
        }
      }
    },
    // Called when backend returns 403 ACCOUNT_BLOCKED — freezes the session in-place
    setBlocked(
      state,
      action: PayloadAction<{ reason?: string; blockedAt?: string }>
    ) {
      state.kycStatus = 'BLOCKED';
      state.blockedReason = action.payload.reason || 'Regulatory compliance freeze ordered by CDSCO authority.';
      state.blockedAt = action.payload.blockedAt;
      // Keep user info so blocked screen can display company name
      if (state.user) {
        state.user.kycStatus = 'BLOCKED';
        state.user.blockedReason = action.payload.reason;
        state.user.blockedAt = action.payload.blockedAt;
        try {
          localStorage.setItem('pharma_user', JSON.stringify(state.user));
        } catch (e) {
          // ignore
        }
      }
    },
    updateUser(state, action: PayloadAction<ManufacturerProfile>) {
      state.user = action.payload;
      state.kycStatus = action.payload.kycStatus || state.kycStatus;
      try {
        localStorage.setItem('pharma_user', JSON.stringify(action.payload));
      } catch (e) {
        // ignore
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.kycStatus = 'PENDING';
      state.authView = 'landing';
      state.requires2FA = false;
      state.pendingLoginEmail = null;
      state.loading = false;
      state.error = null;

      try {
        localStorage.removeItem('pharma_token');
        localStorage.removeItem('pharma_user');
      } catch (e) {
        // ignore
      }
    },
  },
});

export const {
  setAuthView,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  setPendingLoginEmail,
  loginSuccess,
  registerSuccess,
  setKYCStatus,
  setUnblocked,
  setBlocked,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
