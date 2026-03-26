import { create } from 'zustand';
import type { SkeinItem, SkeinCreateData, Filters } from '@/lib/types';
import { api } from '@/api/api';
import { useFiltersStore } from '@/store/filters.store';

interface SkeinsState {
  grouped: Record<string, Record<string, SkeinItem[]>>;
  isLoading: boolean;
  isError: boolean;
  fetch: (filters?: Filters) => Promise<void>;
  create: (data: SkeinCreateData) => Promise<void>;
  update: (id: number, data: SkeinCreateData) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useSkeinsStore = create<SkeinsState>((set, get) => ({
  grouped: {},
  isLoading: false,
  isError: false,

  fetch: async (filters?: Filters) => {
    set({ isLoading: true, isError: false });
    try {
      const params = new URLSearchParams();
      if (filters?.skipReserved) params.set('skip_reserved', 'true');
      for (const brand of filters?.brand ?? []) params.append('brand', brand);
      for (const color of filters?.colors ?? []) params.append('colors', color);
      for (const fiber of filters?.fibers ?? []) params.append('fibers', fiber);
      const query = params.size > 0 ? `?${params}` : '';
      const grouped = await api.getSkeins(query);
      set({ grouped, isLoading: false });
    } catch {
      set({ isLoading: false, isError: true });
    }
  },

  create: async (data: SkeinCreateData) => {
    await api.createSkein(data);
    await get().fetch(useFiltersStore.getState().filters);
  },

  update: async (id: number, data: SkeinCreateData) => {
    await api.updateSkein(id, data);
    await get().fetch(useFiltersStore.getState().filters);
  },

  remove: async (id: number) => {
    await api.deleteSkein(id);
    await get().fetch(useFiltersStore.getState().filters);
  },
}));
