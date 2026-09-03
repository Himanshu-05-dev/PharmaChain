import axios from 'axios';

const getClient = () => {
    const baseURL     = process.env.MANUFACTURER_SERVICE_URL || 'http://localhost:3001';
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    return axios.create({
        baseURL,
        headers: {
            'X-Admin-Token': ADMIN_TOKEN,
            'Content-Type':  'application/json',
        },
        timeout: 15_000,
    });
};

export const fetchManufacturers = async (params = {}) => {
    console.log('[manufacturerClient.service] GET /api/manufacturer/internal/list with params:', params);
    const client = getClient();
    const res = await client.get('/api/manufacturer/internal/list', { params });
    return res.data;
};

export const fetchManufacturerById = async (id) => {
    console.log(`[manufacturerClient.service] GET /api/manufacturer/internal/${id}`);
    const client = getClient();
    const res = await client.get(`/api/manufacturer/internal/${encodeURIComponent(id)}`);
    return res.data;
};

export const approveManufacturerKYC = async (manufacturerId) => {
    console.log(`[manufacturerClient.service] POST /api/manufacturer/auth/kyc/approve for ${manufacturerId}`);
    const client = getClient();
    const res = await client.post('/api/manufacturer/auth/kyc/approve', { manufacturerId });
    return res.data;
};

export const rejectManufacturerKYC = async (manufacturerId, reason) => {
    console.log(`[manufacturerClient.service] POST /api/manufacturer/auth/kyc/reject for ${manufacturerId}, reason: "${reason}"`);
    const client = getClient();
    const res = await client.post('/api/manufacturer/auth/kyc/reject', { manufacturerId, reason });
    return res.data;
};

export const blockManufacturerKYC = async (manufacturerId, reason, adminId) => {
    console.log(`[manufacturerClient.service] POST /api/manufacturer/auth/kyc/block for ${manufacturerId}, reason: "${reason}"`);
    const client = getClient();
    const res = await client.post('/api/manufacturer/auth/kyc/block', { manufacturerId, reason, adminId });
    return res.data;
};

export const unblockManufacturerKYC = async (manufacturerId, adminId) => {
    console.log(`[manufacturerClient.service] POST /api/manufacturer/auth/kyc/unblock for ${manufacturerId}`);
    const client = getClient();
    const res = await client.post('/api/manufacturer/auth/kyc/unblock', { manufacturerId, adminId });
    return res.data;
};

export const fetchManufacturerStats = async () => {
    console.log('[manufacturerClient.service] GET /api/manufacturer/internal/stats');
    const client = getClient();
    const res = await client.get('/api/manufacturer/internal/stats');
    return res.data;
};
