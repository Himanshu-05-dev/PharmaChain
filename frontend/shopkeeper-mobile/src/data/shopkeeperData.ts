import { InventoryItem, PharmacyTransaction, ShopDashboardMetrics } from '../types';

export const DEFAULT_SHOP_METRICS: ShopDashboardMetrics = {
  verifiedPacksInStock: 0,
  packsReceivedToday: 0,
  salesRecordedToday: 0,
  activeRecallsOrFlags: 0,
  expiringIn30Days: 0,
  blockchainIntegrityScore: 100,
};

export const INITIAL_INVENTORY_DATA: InventoryItem[] = [];
export const INITIAL_HISTORY_DATA: PharmacyTransaction[] = [];
