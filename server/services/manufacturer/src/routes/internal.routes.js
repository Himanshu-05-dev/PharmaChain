import express from 'express';
import {
    internalListController,
    internalDetailController,
    internalStatsController,
    kycApproveController,
    kycRejectController,
    kycBlockController,
    kycUnblockController,
} from '../controllers/auth.controller.js';

const router = express.Router();

// ── Internal Admin-Guarded Endpoints (X-Admin-Token required) ────────────────

// GET /api/manufacturer/internal/list
router.get('/list', internalListController);

// GET /api/manufacturer/internal/stats
router.get('/stats', internalStatsController);

// GET /api/manufacturer/internal/:id
router.get('/:id', internalDetailController);

// POST /api/manufacturer/internal/approve (alias to /auth/kyc/approve)
router.post('/approve', kycApproveController);

// POST /api/manufacturer/internal/reject (alias to /auth/kyc/reject)
router.post('/reject', kycRejectController);

// POST /api/manufacturer/internal/block (alias to /auth/kyc/block)
router.post('/block', kycBlockController);

// POST /api/manufacturer/internal/unblock (alias to /auth/kyc/unblock)
router.post('/unblock', kycUnblockController);

export default router;
