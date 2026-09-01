import { consumerApiClient } from './client';
import type { ConsumerUser } from '../../store/authStore';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthResponse {
  status: string;
  token: string;
  user: ConsumerUser;
}

interface MeResponse {
  status: string;
  user: ConsumerUser;
}

// ── API Calls ─────────────────────────────────────────────────────────────────

/**
 * Sends the Google authorization code to the consumer-service backend.
 * The backend performs the secure server-side code exchange (keeping the
 * Google client secret off the device) and returns a PharmaChain JWT.
 *
 * @param code        The authorization code from expo-auth-session
 * @param redirectUri The exact redirect URI used in the OAuth request (must match)
 */
export const signInWithGoogleCode = async (
  code: string,
  redirectUri: string
): Promise<{ token: string; user: ConsumerUser }> => {
  const response = await consumerApiClient.post<AuthResponse>('/auth/google', {
    code,
    redirectUri,
  });
  return { token: response.data.token, user: response.data.user };
};

/**
 * Validates an existing PharmaChain JWT and returns the current user identity.
 * Used on app boot to restore a saved session from SecureStore.
 */
export const getMe = async (token: string): Promise<ConsumerUser> => {
  const response = await consumerApiClient.get<MeResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
};
