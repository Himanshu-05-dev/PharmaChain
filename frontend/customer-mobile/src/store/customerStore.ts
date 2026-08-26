import { create } from 'zustand';
import { User, SavedMedicine } from '../types';
import { SAVED_MEDICINES } from '../data/customerData';

interface CustomerState {
  user: User | null;
  savedMedicines: SavedMedicine[];
  setUser: (user: User) => void;
  clearUser: () => void;
  addSavedMedicine: (medicine: SavedMedicine) => void;
  removeSavedMedicine: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  user: null,
  savedMedicines: SAVED_MEDICINES,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
  addSavedMedicine: (medicine: SavedMedicine) =>
    set((state) => ({
      savedMedicines: [medicine, ...state.savedMedicines.filter((m) => m.id !== medicine.id && m.packId !== medicine.packId)],
    })),
  removeSavedMedicine: (id: string) =>
    set((state) => ({
      savedMedicines: state.savedMedicines.filter((m) => m.id !== id),
    })),
}));
