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
    const med = data.medicine || {};
    const batch = data.batch || {};
    const hasValidPayload = Boolean(payload && Object.keys(payload).length > 0 && (payload.batchId || payload.medicineName || med.medicineName));

    const medicineName =
      med.medicineName ||
      batch.medicineName ||
      payload.medicineName ||
      payload.name ||
      (hasValidPayload
        ? (data.packHash ? `Verified Pack (${data.packHash.substring(0, 8)})` : 'Verified Formulation')
        : 'Unverified QR Code');

    const genericName = med.genericName || batch.genericName || payload.genericName || medicineName;
    const brandName = med.brandName || batch.brandName || payload.brandName || null;
    const dosage = med.dosage || batch.dosage || payload.dosage || 'Standard Formulation';
    const composition = med.composition || batch.composition || null;
    const drugSchedule = med.drugSchedule || batch.drugSchedule || null;
    const storageCondition = med.storageCondition || batch.storageConditions || null;
    const productionSite = med.productionSite || batch.productionSite || null;

    const batchId = med.batchId || batch.batchId || payload.batchId || (hasValidPayload ? 'BATCH-LIVE-001' : 'N/A');
    const expiryDate = med.expiryDate || batch.expiryDate || payload.expiryDate || 'N/A';
    const manufacturingDate = med.manufacturingDate || batch.manufacturingDate || payload.mfgDate || payload.manufacturingDate || (hasValidPayload ? '2026-08-01' : 'N/A');

    return {
      success: isValid,
      status,
      uiState,
      message: data.message || (isValid ? 'Verification complete' : 'Invalid or unrecognized QR code'),
      valid: data.valid,
      packHash: data.packHash,
      scannedHash: data.scannedHash,
      blockchainStatus: data.blockchainStatus || uiState,
      detail: data.detail,
      payload,
      pack: {
        packId: data.packHash || payload.serial || (isValid ? 'PACK-SERIAL' : 'N/A'),
        medicineName,
        genericName,
        brandName,
        batchId,
        manufacturingDate,
        expiryDate,
        dosage,
        composition,
        drugSchedule,
        storageCondition,
        serial: payload.serial,
      },
      manufacturer: {
        name: med.manufacturerName || batch.manufacturerName || payload.manufacturerId || (hasValidPayload ? 'Verified CDSCO Manufacturer' : 'Unknown / Unregistered'),
        id: payload.manufacturerId || null,
        productionSite,
        licenseNumber: med.mfgLicenseNumber || batch.manufacturingLicenseNo || null,
      },
      dispensingShop: data.dispensingShop || (data.detail ? {
        shopId: data.detail.sellerId || null,
        name: data.detail.shopName || null,
        licenseNumber: data.detail.licenseNumber || null,
        location: data.detail.location || null,
        latitude: data.detail.latitude || null,
        longitude: data.detail.longitude || null,
        sellingDate: data.detail.sellingDate || null,
        sellingTime: data.detail.sellingTime || null,
        timestamp: data.detail.timestamp || null,
      } : null),
      shop: {
        name: data.dispensingShop?.name || data.detail?.shopName || 'Registered Pharmacy Partner',
        licenseNumber: data.dispensingShop?.licenseNumber || data.detail?.licenseNumber || null,
        location: data.dispensingShop?.location || data.detail?.location || null,
      },
      transaction: {
        status: data.blockchainStatus || uiState,
        saleTime: data.dispensingShop?.timestamp || data.detail?.timestamp || (data.dispensingShop?.sellingDate ? `${data.dispensingShop.sellingDate} ${data.dispensingShop.sellingTime || ''}` : null) || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        location: data.dispensingShop?.location || data.detail?.location || null,
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
