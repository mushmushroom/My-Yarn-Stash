import { create } from 'zustand';
import type { Filters } from '@/lib/types';

interface FiltersState {
  filters: Filters;
  setFilters: (key: keyof Filters, value?: string | boolean) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: {},
  setFilters: (key, value) => {
    set((state) => {
      if (key === 'skipReserved') {
        return { filters: { ...state.filters, skipReserved: !state.filters.skipReserved } };
      }

      const existingFilterByKey = (state.filters[key] as string[] | undefined) ?? [];
      const stringValue = value as string;
      const updatedFiltersByKey = existingFilterByKey.includes(stringValue)
        ? existingFilterByKey.filter((v) => v !== stringValue)
        : [...existingFilterByKey, stringValue];
      return { filters: { ...state.filters, [key]: updatedFiltersByKey } };
    });
  },
  clearFilters: () => set({ filters: {} }),
}));
