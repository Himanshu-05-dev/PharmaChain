import express from 'express';
import { requireServiceToken } from '../middleware/requireServiceToken.middleware.js';
import { mintBatchController, retryBlockchainSyncController } from '../controllers/batch.controller.js';

const router = express.Router();

// ── All batch routes require X-Service-Token ──────────────────────────────────
router.use(requireServiceToken);

// POST /core/batch/mint — sign JWTs for all packs in a batch and record on Fabric
router.post('/mint', mintBatchController);

// POST /core/batch/:batchId/retry-blockchain — sync existing CSV pack transitions to Fabric
router.post('/:batchId/retry-blockchain', retryBlockchainSyncController);

export default router;
