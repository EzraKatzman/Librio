import { create } from "zustand";
import { Book } from "../types/book";

interface AppState {
    recentlyScanned: Book[];
    isScanning: boolean;
    addScannedBook: (book: Book) => void;
    setScanning: (scanning: boolean) => void;
    clearRecent: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    recentlyScanned: [],
    isScanning: false,

    addScannedBook: (book) => set((state) => ({
        recentlyScanned: [book, ...state.recentlyScanned.slice(0, 9)]
    })),

    setScanning: (scanning) => set({ isScanning: scanning }),

    clearRecent: () => set({ recentlyScanned: [] }),
}));
