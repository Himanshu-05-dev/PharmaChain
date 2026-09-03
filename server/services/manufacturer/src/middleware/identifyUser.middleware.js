// ── identifyUser middleware — manufacturer-service ────────────────────────────
// Verifies HS256 JWT from Authorization header or HttpOnly cookie.
// Attaches req.user (decoded payload) and req.user.id (manufacturer DB id).
// Checks DB state to ensure blocked or unapproved manufacturers are denied.
// Returns 401 on missing/invalid token, 403 if blocked or unverified.

import jwt from 'jsonwebtoken';
import Manufacturer from '../models/manufacturer.model.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Validates the manufacturer's session JWT and verifies active account status.
 * Token is read from:
 *   1. Authorization: Bearer <token> header
 *   2. HttpOnly cookie named 'mfr_token' (fallback)
 * Attaches req.user, req.manufacturer, and req.authToken on success.
 */
export const identifyUser = async (req, res, next) => {
    // ── Extract token ─────────────────────────────────────────────────────────
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies?.mfr_token) {
        token = req.cookies.mfr_token;
    }

    // ── Validate presence ─────────────────────────────────────────────────────
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: No authentication token provided',
        });
    }

    // ── Verify JWT signature and expiry ───────────────────────────────────────
    try {
        if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');

        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

        // ── Attach identity to request ────────────────────────────────────────
        req.user = decoded;
        req.user.id = decoded.id || decoded.sub;
        req.authToken = token;

        // ── Verify live DB status for regulatory block enforcement ───────────
        const manufacturer = await Manufacturer.findOne({
            $or: [
                { manufacturerId: req.user.id },
                { email: (decoded.email || '').toLowerCase() },
            ],
        }).select('-passwordHash').lean();

        if (!manufacturer) {
            console.warn(`[manufacturer-service identifyUser] Account not found for token id: ${req.user.id}`);
            return res.status(401).json({ status: 'error', code: 'ACCOUNT_NOT_FOUND', message: 'Manufacturer account not found' });
        }

        if (manufacturer.kycStatus === 'BLOCKED' || manufacturer.kycStatus === 'SUSPENDED') {
            console.warn(`[manufacturer-service identifyUser] Access BLOCKED for manufacturer: ${manufacturer.manufacturerId}, reason: "${manufacturer.blockedReason}"`);
            return res.status(403).json({
                status: 'error',
                code: 'ACCOUNT_BLOCKED',
                message: 'Your manufacturer account has been blocked by the CDSCO regulatory authority.',
                reason: manufacturer.blockedReason || 'Regulatory compliance freeze.',
                blockedAt: manufacturer.blockedAt,
            });
        }

        if (manufacturer.kycStatus !== 'APPROVED') {
            console.warn(`[manufacturer-service identifyUser] Access denied: KYC status is ${manufacturer.kycStatus} for ${manufacturer.manufacturerId}`);
            return res.status(403).json({
                status: 'error',
                code: 'KYC_PENDING',
                message: 'Account KYC review is still pending CDSCO regulatory approval.',
                kycStatus: manufacturer.kycStatus,
            });
        }

        req.manufacturer = manufacturer;
        next();
    } catch (err) {
        console.error('[manufacturer-service Auth] JWT verification failed:', err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', message: 'Unauthorized: Token has expired' });
        }

        return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid token' });
    }
};
