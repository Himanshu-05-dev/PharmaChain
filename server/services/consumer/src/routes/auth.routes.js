import express from 'express';
import { googleSignInController, getMeController } from '../controllers/auth.controller.js';
import { verifyJwt } from '../middleware/verifyJwt.middleware.js';

const router = express.Router();

// ── Authentication Routes ─────────────────────────────────────────────────────

// POST /api/consumer/auth/google
// Exchange a Google authorization code for a PharmaChain JWT.
// Public — no auth required (this IS the sign-in endpoint).
router.post('/google', googleSignInController);

// GET /api/consumer/auth/me
// Validate session and return the current user identity.
// Protected — requires a valid PharmaChain JWT in Authorization header.
router.get('/me', verifyJwt, getMeController);

export default router;
