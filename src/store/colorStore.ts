import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ColorHistory {
  color: string;
  timestamp: number;
}

interface ColorState {
  recentColors: ColorHistory[];
  savedPalettes: string[][];
  addRecentColor: (color: string) => void;
  addPalette: (palette: string[]) => void;
  removePalette: (index: number) => void;
  clearHistory: () => void;
}

export const useColorStore = create<ColorState>()(
  persist(
    (set) => ({
      recentColors: [],
      savedPalettes: [],
      addRecentColor: (color: string) =>
        set((state) => ({
          recentColors: [
            { color, timestamp: Date.now() },
            ...state.recentColors,
          ].slice(0, 20),
        })),
      addPalette: (palette: string[]) =>
        set((state) => ({
          savedPalettes: [...state.savedPalettes, palette],
        })),
      removePalette: (index: number) =>
        set((state) => ({
          savedPalettes: state.savedPalettes.filter((_, i) => i !== index),
        })),
      clearHistory: () =>
        set({
          recentColors: [],
          savedPalettes: [],
        }),
    }),
    {
      name: 'color-storage',
    }
  )
);