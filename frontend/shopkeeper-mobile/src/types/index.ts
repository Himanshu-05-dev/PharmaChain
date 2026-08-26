export * from './auth';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Expiring Soon' | 'Quarantined';

export interface InventoryItem {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  mfgDate: string;
  expiryDate: string;
  daysToExpiry: number;
  status: StockStatus;
  packSerialId: string;
  distributor: string;
  invoiceNumber: string;
  purchaseDate: string;
  unitPrice: number;
  sellingPrice: number;
  locationRack: string;
}

export type TransactionType = 'DISPENSE' | 'STOCK_RECEIVED' | 'RETURN_DEFECTIVE' | 'QUARANTINE_FLAG';

export interface PharmacyTransaction {
  id: string;
  type: TransactionType;
  medicineName: string;
  genericName: string;
  batchNumber: string;
  packSerialId: string;
  quantity: number;
  timestamp: string;
  customerOrDistributor: string;
  invoiceOrRxId: string;
  status: 'Verified' | 'Suspicious' | 'Counterfeit' | 'Completed';
  blockchainTxHash: string;
}

export interface ShopDashboardMetrics {
  verifiedPacksInStock: number;
  packsReceivedToday: number;
  salesRecordedToday: number;
  activeRecallsOrFlags: number;
  expiringIn30Days: number;
  blockchainIntegrityScore: number;
}
