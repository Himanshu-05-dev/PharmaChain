export type KYCStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type ScanMode = 'DISPENSE' | 'RECEIVE' | 'VERIFY';

export type NavRoute =
  | 'dashboard'
  | 'pos'
  | 'intake'
  | 'inventory'
  | 'sales'
  | 'recalls'
  | 'profile'
  | 'security';

export interface ShopkeeperUser {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  licenseNumber: string; // CDSCO Form 20 / 21
  gstin: string;
  pharmacistRegNo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  kycStatus: KYCStatus;
  createdAt: string;
}

export interface ShopInventoryItem {
  id: string;
  sku: string;
  medicineName: string;
  genericName: string;
  category: 'Antibiotics' | 'Analgesics' | 'Cardiovascular' | 'Antidiabetic' | 'Gastrointestinal' | 'Respiratory' | 'Vitamins';
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment';
  strength: string;
  batchId: string;
  manufacturerName: string;
  packCount: number;
  unitMrp: number;
  manufacturingDate: string;
  expiryDate: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'EXPIRING_SOON' | 'RECALLED' | 'OUT_OF_STOCK';
  daysToExpiry: number;
  lastIntakeDate: string;
}

export interface POSCartItem {
  packHash: string;
  signedToken: string;
  batchId: string;
  medicineName: string;
  genericName: string;
  dosage: string;
  unitMrp: number;
  expiryDate: string;
  manufacturerName: string;
  quantity: number;
  scannedAt: string;
  status: 'VALID' | 'WARNING' | 'RECALLED' | 'ALREADY_SOLD';
}

export interface SaleTransaction {
  id: string;
  invoiceNo: string;
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  prescriptionNo?: string;
  items: Array<{
    packHash: string;
    batchId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD' | 'CREDIT';
  fabricTxId: string;
  blockNumber: number;
  timestamp: string;
  verifiedStatus: 'SOLD_ON_CHAIN' | 'COMPLETED';
}

export interface InboundIntakeEvent {
  id: string;
  deliveryChallanNo: string;
  distributorName: string;
  batchId: string;
  medicineName: string;
  packsReceived: number;
  signatureVerified: boolean;
  fabricTxId: string;
  timestamp: string;
  status: 'SUCCESS' | 'DUPLICATE_REJECTED' | 'EXPIRED_REJECTED' | 'RECALLED_REJECTED';
}

export interface ShopRecallAlert {
  id: string;
  batchId: string;
  medicineName: string;
  manufacturer: string;
  affectedPacksInShop: number;
  reason: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MODERATE';
  date: string;
  status: 'ACTIVE' | 'ISOLATED' | 'RETURNED_TO_DISTRIBUTOR';
  quarantineActionsTaken: string[];
}

export interface FraudIncidentReport {
  id: string;
  packHash: string;
  detectedIssue: 'CLONED_QR' | 'ALREADY_SOLD' | 'UNREGISTERED_BATCH' | 'INVALID_ECDSA';
  scannedAt: string;
  medicineName: string;
  reportedToCDSCO: boolean;
  status: 'FLAGGED' | 'INVESTIGATING' | 'RESOLVED';
}

export interface ScanVerificationResponse {
  valid: boolean;
  status: 'AT_SHOP' | 'MINTED' | 'SOLD' | 'RECALLED' | 'EXPIRED' | 'INVALID_SIGNATURE' | 'NOT_FOUND';
  medicineName?: string;
  genericName?: string;
  dosage?: string;
  batchId?: string;
  manufacturerName?: string;
  expiryDate?: string;
  unitMrp?: number;
  packHash?: string;
  signedToken?: string;
  message?: string;
  error?: string;
}
