import { create } from 'zustand';
import { DealState, Deal } from '@/types';
import { dealsAPI } from '@/lib/api';

export const useDealsStore = create<DealState>()((set, get) => ({
  deals: [],
  loading: false,
  error: null,

  fetchDeals: async () => {
    set({ loading: true, error: null });
    try {
      const deals = await dealsAPI.getDeals();
      set({ deals, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createDeal: async (dealData: Partial<Deal>) => {
    try {
      const newDeal = await dealsAPI.createDeal(dealData);
      set((state) => ({
        deals: [...state.deals, newDeal],
      }));
      return newDeal;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateDeal: async (id: string, updates: Partial<Deal>) => {
    try {
      const updatedDeal = await dealsAPI.updateDeal(id, updates);
      set((state) => ({
        deals: state.deals.map((deal) =>
          deal.id === id ? updatedDeal : deal
        ),
      }));
      return updatedDeal;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteDeal: async (id: string) => {
    try {
      await dealsAPI.deleteDeal(id);
      set((state) => ({
        deals: state.deals.filter((deal) => deal.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  moveDeal: async (id: string, stage: string) => {
    try {
      const updatedDeal = await dealsAPI.moveDeal(id, stage);
      set((state) => ({
        deals: state.deals.map((deal) =>
          deal.id === id ? { ...deal, stage } : deal
        ),
      }));
      return updatedDeal;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));