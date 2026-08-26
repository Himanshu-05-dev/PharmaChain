import { apiClient } from './client';

export const receiveMedicine = async (packId: string, idempotencyKey: string) => {
  const response = await apiClient.post('/api/v1/transactions/receive', { packId }, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });
  return response.data;
};

export const sellMedicine = async (packId: string, idempotencyKey: string) => {
  const response = await apiClient.post('/api/v1/transactions/sell', { packId }, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });
  return response.data;
};

export const returnMedicine = async (packId: string, reason: string, idempotencyKey: string) => {
  const response = await apiClient.post('/api/v1/transactions/return', { packId, reason }, {
    headers: { 'Idempotency-Key': idempotencyKey }
  });
  return response.data;
};
