import { create } from "zustand";

interface TransitionState {
    isActive: boolean;
    isExiting: boolean;
    startTransition: () => void;
    endTransition: () => void;
    setIsExiting: (value: boolean) => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
    isActive: false,
    isExiting: false,
    startTransition: () => set({ isActive: true, isExiting: false }),
    endTransition: () => set({ isActive: false, isExiting: false }), // Reset fully
    setIsExiting: (value) => set({ isExiting: value }),
}));
