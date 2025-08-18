// stores/uiStore.ts
import { create } from 'zustand';

interface UiState {
  isAuthModalOpen: boolean;
  toggleAuthModal: (open?: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAuthModalOpen: false, // Initial state: modal is closed
  toggleAuthModal: (open) => 
    set((state) => ({ isAuthModalOpen: open !== undefined ? open : !state.isAuthModalOpen })),
}));