import { create } from "zustand";

interface usePromodalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePromodal = create<usePromodalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
