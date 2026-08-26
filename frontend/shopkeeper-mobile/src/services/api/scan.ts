import { apiClient } from './client';

/**
 * 1. Authenticated Medicine Scan (Pre-sale verification)
 * POST /api/medicine/scan
 */
export const scanMedicine = async (qrData: string) => {
  const response = await apiClient.post('/api/medicine/scan', { qrData });
  return response.data;
};

/**
 * 2. Inbound Stock Intake Scan
 * POST /api/shopkeeper/scan/intake
 */
export const intakeMedicine = async (payload: {
  qrData: string;
  deliveryChallanNo?: string;
  distributorName?: string;
}) => {
  const response = await apiClient.post('/api/shopkeeper/scan/intake', payload);
  return response.data;
};

/**
 * 3. Point of Sale Dispense Scan
 * POST /api/shopkeeper/scan/sale
 */
export const dispenseMedicine = async (payload: {
  qrData: string;
  patientName?: string;
  patientPhone?: string;
  doctorName?: string;
  paymentMode?: 'CASH' | 'UPI' | 'CARD';
}) => {
  const response = await apiClient.post('/api/shopkeeper/scan/sale', payload);
  return response.data;
};

/**
 * 4. Public Consumer / Walk-in Scan
 * POST /api/v1/scan/customer
 */
export const scanCustomerMedicine = async (qrData: string) => {
  const response = await apiClient.post('/api/v1/scan/customer', { qrData });
  return response.data;
};
