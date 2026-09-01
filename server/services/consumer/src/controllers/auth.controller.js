import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/consumer/auth/google
 *
 * Receives a Google authorization code from the mobile app, exchanges it
 * server-side for a Google ID Token (keeping the client secret off the device),
 * verifies the token cryptographically, and mints a stateless PharmaChain JWT.
 *
 * No database or user collection is required — the JWT IS the session.
 *
 * Body: { code: string, redirectUri: string }
 * Response: { status, token, user: { googleId, email, name, picture } }
 */
export const googleSignInController = async (req, res) => {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
        return res.status(400).json({
            status: 'error',
            message: 'code and redirectUri are required',
        });
    }

    try {
        // Instantiated at request time so env vars are read after dotenv.config()
        const googleClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID_WEB,
            process.env.GOOGLE_CLIENT_SECRET_WEB,
            redirectUri
        );

        // ── Step 1: Exchange authorization code for Google tokens ────────────
        // This is done server-side so the client secret never leaves the server.
        const { tokens } = await googleClient.getToken(code);

        if (!tokens.id_token) {
            throw new Error('Google did not return an ID token in the token exchange response');
        }

        // ── Step 2: Cryptographically verify the ID token ─────────────────────
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID_WEB,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // ── Step 3: Mint a stateless PharmaChain session JWT ──────────────────
        const pharmaToken = jwt.sign(
            { googleId, email, name, picture },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log(`[consumer-service Auth] Google sign-in — email: ${email}`);

        return res.status(200).json({
            status: 'success',
            token: pharmaToken,
            user: { googleId, email, name, picture },
        });
    } catch (error) {
        console.error('[consumer-service Auth] googleSignInController error:', error.message);
        return res.status(401).json({
            status: 'error',
            message: 'Google authentication failed. The code may be invalid or already used.',
        });
    }
};

/**
 * GET /api/consumer/auth/me
 *
 * Returns the current user identity encoded in the PharmaChain JWT.
 * Protected by the verifyJwt middleware — req.consumer is already populated.
 */
export const getMeController = (req, res) => {
    return res.status(200).json({
        status: 'success',
        user: req.consumer,
    });
};
