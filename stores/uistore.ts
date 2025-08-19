// stores/uiStore.ts
import { create } from 'zustand';

interface UiState {
  isAuthModalOpen: boolean;
  toggleAuthModal: (open?: boolean) => void;
  isShowLoginContent:boolean;
  toggleShowLoginContent: (isLogin?: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isShowLoginContent: true, // Initial state: show login content
  isAuthModalOpen: false, // Initial state: modal is closed
  toggleAuthModal: (open) => 
    set((state) => ({ isAuthModalOpen: open !== undefined ? open : !state.isAuthModalOpen })),

  toggleShowLoginContent: (isLogin) =>
    set((state) => ({ isShowLoginContent: isLogin !== undefined ? isLogin : !state.isShowLoginContent })),      
}));