import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SavedMedicine } from '../types';
import { SAVED_MEDICINES } from '../data/customerData';

export interface ScanHistoryRecord {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  manufacturer: string;
  scannedAt: string;
  location: string;
  status: 'Verified' | 'Suspicious' | 'Counterfeit';
  trustScore: number;
  packId: string;
}

interface CustomerState {
  user: User | null;
  savedMedicines: SavedMedicine[];
  scanHistory: ScanHistoryRecord[];
  setUser: (user: User) => void;
  clearUser: () => void;
  addSavedMedicine: (medicine: SavedMedicine) => void;
  removeSavedMedicine: (id: string) => void;
  addScanRecord: (record: ScanHistoryRecord) => void;
  clearHistory: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      user: null,
      savedMedicines: SAVED_MEDICINES,
      scanHistory: [],
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
      addSavedMedicine: (medicine: SavedMedicine) =>
        set((state) => ({
          savedMedicines: [
            medicine,
            ...state.savedMedicines.filter(
              (m) => m.id !== medicine.id && m.packId !== medicine.packId
            ),
          ],
        })),
      removeSavedMedicine: (id: string) =>
        set((state) => ({
          savedMedicines: state.savedMedicines.filter((m) => m.id !== id),
        })),
      addScanRecord: (record: ScanHistoryRecord) =>
        set((state) => ({
          scanHistory: [
            record,
            ...state.scanHistory.filter((r) => r.packId !== record.packId),
          ],
        })),
      clearHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: 'pharmachain-customer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
