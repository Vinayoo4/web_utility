import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImageHistory {
  url: string;
  timestamp: number;
}

interface ImageState {
  recentImages: ImageHistory[];
  addRecentImage: (url: string) => void;
  removeRecentImage: (url: string) => void;
  clearHistory: () => void;
}

export const useImageStore = create<ImageState>()(
  persist(
    (set) => ({
      recentImages: [],
      addRecentImage: (url: string) =>
        set((state) => ({
          recentImages: [
            { url, timestamp: Date.now() },
            ...state.recentImages.filter((img) => img.url !== url),
          ].slice(0, 10),
        })),
      removeRecentImage: (url: string) =>
        set((state) => ({
          recentImages: state.recentImages.filter((img) => img.url !== url),
        })),
      clearHistory: () =>
        set({
          recentImages: [],
        }),
    }),
    {
      name: 'image-storage',
    }
  )
);