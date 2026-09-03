import jwt from 'jsonwebtoken';

// ── Middleware ────────────────────────────────────────────────────────────────

/**
 * Validates a PharmaChain JWT from the Authorization: Bearer <token> header.
 * On success, attaches the decoded payload to req.consumer and calls next().
 * On failure, responds with 401.
 */
export const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Missing or malformed Authorization header',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // JWT_SECRET is read at call time, not module-init time, so dotenv is guaranteed to have run
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.consumer = decoded;
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError'
                ? 'Session expired. Please sign in again.'
                : 'Invalid session token';
        return res.status(401).json({ status: 'error', message });
    }
};
