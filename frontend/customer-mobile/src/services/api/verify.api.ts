import { consumerApiClient, apiClient } from './client';
import { VerificationResult, BackendUIState, VerificationStatus } from '../../types';

/**
 * Maps the 7 backend UI states to the application's VerificationStatus.
 */
export const mapBackendUIStateToStatus = (uiState: BackendUIState): VerificationStatus => {
  switch (uiState) {
    case 'GENUINE':
      return 'AUTHENTIC';
    case 'AT_SHOP':
      return 'AUTHENTIC_AVAILABLE';
    case 'ALREADY_SOLD':
      return 'AUTHENTIC_SOLD';
    case 'RECALLED':
      return 'RECALLED';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'COUNTERFEIT':
      return 'SUSPICIOUS';
    case 'NOT_FOUND':
      return 'INVALID';
    default:
      return 'AUTHENTIC';
  }
};

/**
 * Verifies a scanned QR code data matrix or URL against the live backend consumer service.
 * @param qrData Raw scanned QR code string, signed JWT token, or URL
 */
export const verifyMedicineQR = async (qrData: string): Promise<VerificationResult> => {
  if (!qrData || typeof qrData !== 'string') {
    return {
      success: false,
      status: 'INVALID',
      message: 'Invalid QR code data provided.',
      risk: {
        level: 'High',
        qrDuplicationSuspected: false,
      },
    };
  }

  try {
    // 1. Primary: POST /api/consumer/verify (services/consumer)
    const response = await consumerApiClient.post('/verify', { qrData });
    const data = response.data;

    const uiState: BackendUIState = data.uiState || (data.valid ? 'GENUINE' : 'COUNTERFEIT');
    const status = mapBackendUIStateToStatus(uiState);
    const isValid = data.valid !== false && uiState !== 'COUNTERFEIT' && uiState !== 'NOT_FOUND';

    const payload = data.payload || {};
    const medicineName =
      payload.medicineName ||
      payload.name ||
      (data.packHash ? `Verified Pack (${data.packHash.substring(0, 8)})` : 'Verified Formulation');

    const batchId = payload.batchId || 'BATCH-LIVE-001';
    const expiryDate = payload.expiryDate || 'N/A';
    const manufacturingDate = payload.mfgDate || payload.manufacturingDate || '2026-08-01';

    return {
      success: isValid,
      status,
      uiState,
      message: data.message || 'Verification complete',
      valid: data.valid,
      packHash: data.packHash,
      scannedHash: data.scannedHash,
      blockchainStatus: data.blockchainStatus || uiState,
      detail: data.detail,
      payload,
      pack: {
        packId: data.packHash || payload.serial || 'PACK-SERIAL',
        medicineName,
        batchId,
        manufacturingDate,
        expiryDate,
        dosage: payload.dosage,
        serial: payload.serial,
      },
      manufacturer: {
        name: payload.manufacturerId || 'Verified CDSCO Manufacturer',
        id: payload.manufacturerId,
      },
      shop: {
        name: data.detail?.shopName || 'Registered Pharmacy Partner',
      },
      transaction: {
        status: data.blockchainStatus || uiState,
        saleTime: data.detail?.timestamp || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
      risk: {
        level: uiState === 'GENUINE' || uiState === 'AT_SHOP' ? 'Low' : uiState === 'ALREADY_SOLD' ? 'Medium' : 'High',
        score: uiState === 'GENUINE' ? 98 : uiState === 'AT_SHOP' ? 95 : uiState === 'ALREADY_SOLD' ? 60 : 15,
        qrDuplicationSuspected: uiState === 'ALREADY_SOLD' || uiState === 'COUNTERFEIT',
      },
    };
  } catch (error: any) {
    console.warn('[verifyMedicineQR] Primary consumer service error, attempting fallback...', error?.message);

    // 2. Fallback: Try shopkeeper customer scan route /api/v1/scan/customer
    try {
      const fallbackRes = await apiClient.post('/scan/customer', { qrData });
      const fbData = fallbackRes.data;

      const uiState: BackendUIState = fbData.uiState || (fbData.valid ? 'GENUINE' : 'COUNTERFEIT');
      const status = mapBackendUIStateToStatus(uiState);
      const payload = fbData.payload || {};

      return {
        success: fbData.valid !== false,
        status,
        uiState,
        message: fbData.message || 'Verification complete',
        valid: fbData.valid,
        packHash: fbData.packHash,
        blockchainStatus: fbData.ledgerStatus || uiState,
        payload,
        pack: {
          packId: fbData.packHash || payload.serial || 'PACK-SERIAL',
          medicineName: payload.medicineName || 'Verified Medicine',
          batchId: payload.batchId || 'BATCH-001',
          manufacturingDate: payload.mfgDate || '2026-08-01',
          expiryDate: payload.expiryDate || 'N/A',
        },
        manufacturer: {
          name: payload.manufacturerId || 'Verified Manufacturer',
          id: payload.manufacturerId,
        },
        risk: {
          level: uiState === 'GENUINE' ? 'Low' : 'High',
          score: uiState === 'GENUINE' ? 96 : 30,
          qrDuplicationSuspected: uiState === 'ALREADY_SOLD' || uiState === 'COUNTERFEIT',
        },
      };
    } catch (fallbackError: any) {
      console.error('[verifyMedicineQR] All verification endpoints failed:', fallbackError?.message);
      return {
        success: false,
        status: 'INVALID',
        message: 'Could not connect to PharmaChain verification network. Please check your network connection.',
        risk: {
          level: 'High',
          qrDuplicationSuspected: false,
        },
      };
    }
  }
};
