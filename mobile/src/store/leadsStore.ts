import { create } from 'zustand';
import { Lead } from '../types';

interface LeadsState {
  leads: Lead[];
  isConnected: boolean;
  newLeadId: string | null;
  addLead: (lead: Lead) => void;
  setConnected: (val: boolean) => void;
  clearLeads: () => void;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: [],
  isConnected: false,
  newLeadId: null,

  addLead: (lead) => {
    set((state) => {
      const newLeads = [lead, ...state.leads].slice(0, 50);
      return { leads: newLeads, newLeadId: lead.id };
    });

    setTimeout(() => {
      set((state) => {
        // Only clear if the current newLeadId is still the same lead
        if (state.newLeadId === lead.id) {
          return { newLeadId: null };
        }
        return state;
      });
    }, 4000);
  },

  setConnected: (val) => set({ isConnected: val }),

  clearLeads: () => set({ leads: [], newLeadId: null }),
}));
