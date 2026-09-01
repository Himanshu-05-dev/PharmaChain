/**
 * useBlockStatusPoller
 *
 * Real-time account status synchronization:
 * 1. Checks GET /auth/me IMMEDIATELY on mount / boot / reload.
 * 2. If the user was BLOCKED and is now UNBLOCKED (approved in DB),
 *    instantly dispatches setUnblocked(), restoring the full dashboard
 *    both on page reload and in real time without refreshing.
 * 3. If the user is active (APPROVED) and gets BLOCKED by admin,
 *    instantly dispatches setBlocked(), locking down the dashboard in real time.
 * 4. Continuously polls every 6 seconds so transitions in either direction
 *    (block or unblock) are reflected with minimal latency.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { setBlocked, setUnblocked } from '../slice/auth.slice';
import { fetchAccountStatusAPI } from '../services/auth.api';

const POLL_INTERVAL_MS = 6_000; // 6 seconds for responsive real-time sync

export const useBlockStatusPoller = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, kycStatus, token } = useSelector((state: RootState) => state.auth);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkStatus = useCallback(async () => {
    const activeToken =
      token ||
      (typeof window !== 'undefined' && (localStorage.getItem('pharma_token') || sessionStorage.getItem('pharma_token')));

    if (!activeToken || activeToken === 'pending_token' || activeToken.split('.').length !== 3) {
      return;
    }

    try {
      const result = await fetchAccountStatusAPI();
      if (!result) return; // 403 interceptor handles ACCOUNT_BLOCKED, network fails silently

      if (result.kycStatus === 'BLOCKED' || result.kycStatus === 'SUSPENDED') {
        if (kycStatus !== 'BLOCKED') {
          console.warn(`[useBlockStatusPoller] Account is now ${result.kycStatus}. Freezing dashboard.`);
          dispatch(
            setBlocked({
              reason: result.blockedReason,
              blockedAt: result.blockedAt,
            })
          );
        }
      } else if (result.kycStatus === 'APPROVED') {
        if (kycStatus === 'BLOCKED' || kycStatus === 'SUSPENDED' || kycStatus === 'PENDING') {
          console.log('[useBlockStatusPoller] Account verified as APPROVED. Restoring dashboard access.');
          dispatch(setUnblocked());
        }
      }
    } catch (e) {
      // 403 response interceptor already handles ACCOUNT_BLOCKED
    }
  }, [dispatch, kycStatus, token]);

  useEffect(() => {
    const hasStoredToken =
      token || (typeof window !== 'undefined' && localStorage.getItem('pharma_token'));

    if (!isAuthenticated && !hasStoredToken) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 1. Run check IMMEDIATELY on mount / reload so status is verified with backend instantly
    checkStatus();

    // 2. Schedule recurring poll every 6 seconds
    timerRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, token, checkStatus]);
};
