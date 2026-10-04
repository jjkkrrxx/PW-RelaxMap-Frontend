import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  fetchCategories,
  type LocationCategories,
} from "@/components/utils/locationForm";

interface CategoriesState {
  categories: LocationCategories | null;
  hasHydrated: boolean;
  isLoading: boolean;
  markHydrated: () => void;
  fetchIfEmpty: () => Promise<void>;
}

type PersistedCategoriesState = Pick<CategoriesState, "categories">;

const hasCategories = (categories: LocationCategories | null) =>
  Boolean(
    categories &&
    (categories.locationTypes.length > 0 || categories.regions.length > 0),
  );

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: null,
      hasHydrated: false,
      isLoading: false,
      markHydrated: () => set({ hasHydrated: true }),
      fetchIfEmpty: async () => {
        const state = get();

        if (
          !state.hasHydrated ||
          hasCategories(state.categories) ||
          state.isLoading
        ) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetchCategories();
          set({ categories: response.data });
        } catch (error) {
          console.error("Не вдалося завантажити категорії локацій:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "relaxmap-categories",
      storage: createJSONStorage<PersistedCategoriesState>(() => localStorage),
      partialize: (state): PersistedCategoriesState => ({
        categories: state.categories,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);
