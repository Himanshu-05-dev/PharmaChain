import axios from 'axios';

// ── Constants ─────────────────────────────────────────────────────────────────
const SHOPKEEPER_SERVICE_URL = process.env.SHOPKEEPER_SERVICE_URL || 'http://shopkeeper-service:80';

const client = axios.create({
    baseURL: SHOPKEEPER_SERVICE_URL,
    timeout: 4000,
});

/**
 * Fetches public verified pharmacy details by shopId or drugLicenseNumber.
 * Non-blocking display data only (not security-critical).
 * @param {string} shopId
 * @returns {Promise<Object|null>}
 */
export const getPublicShopkeeperProfile = async (shopId) => {
    if (!shopId) return null;
    try {
        const response = await client.get(`/api/shopkeeper/public/profile/${encodeURIComponent(shopId)}`);
        return response.data?.data || null;
    } catch (err) {
        // Non-fatal — pharmacy name fallback will be used
        return null;
    }
};
