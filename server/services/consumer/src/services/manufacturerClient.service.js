import axios from 'axios';

// ── Constants ─────────────────────────────────────────────────────────────────
const MANUFACTURER_SERVICE_URL = process.env.MANUFACTURER_SERVICE_URL || 'http://manufacturer-service:80';

const client = axios.create({
    baseURL: MANUFACTURER_SERVICE_URL,
    timeout: 5000,
});

/**
 * Fetches public medicine & batch metadata from manufacturer-service.
 * Non-blocking display data only (not security-critical).
 * @param {string} batchId
 * @returns {Promise<Object|null>}
 */
export const getPublicBatchMetadata = async (batchId) => {
    if (!batchId) return null;
    try {
        const response = await client.get(`/api/manufacturer/batch/public/${encodeURIComponent(batchId)}`);
        return response.data?.data || null;
    } catch (err) {
        console.warn(`[consumer-service ManufacturerClient] Batch lookup notice (${batchId}): ${err.message}`);
        return null;
    }
};
