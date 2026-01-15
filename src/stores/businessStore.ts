/**
 * Business Store
 * Manages multiple businesses and active business state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Business, VoiceAgent } from '../lib/supabase';
import {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getVoiceAgent,
  createVoiceAgent,
  updateVoiceAgent,
  getUserPreferences,
  setActiveBusiness as setActiveBusinessDB,
  businessToConfig,
} from '../services/database';
import type { BusinessConfig } from '../types';

interface BusinessState {
  businesses: Business[];
  activeBusiness: Business | null;
  activeVoiceAgent: VoiceAgent | null;
  isLoading: boolean;
  error: string | null;
}

interface BusinessActions {
  loadBusinesses: (userId: string) => Promise<void>;
  loadActiveBusiness: (userId: string) => Promise<void>;
  setActiveBusiness: (userId: string, businessId: string) => Promise<void>;
  addBusiness: (userId: string, config: BusinessConfig) => Promise<{ businessId: string | null; error: string | null }>;
  updateCurrentBusiness: (updates: Partial<BusinessConfig>) => Promise<{ error: string | null }>;
  deleteCurrentBusiness: (userId: string) => Promise<{ error: string | null }>;
  loadVoiceAgent: (businessId: string) => Promise<void>;
  saveVoiceAgent: (businessId: string, agentData: any) => Promise<{ error: string | null }>;
  updateCurrentVoiceAgent: (updates: any) => Promise<{ error: string | null }>;
  getActiveBusinessConfig: () => BusinessConfig | null;
  clearError: () => void;
  reset: () => void;
}

type BusinessStore = BusinessState & BusinessActions;

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      // State
      businesses: [],
      activeBusiness: null,
      activeVoiceAgent: null,
      isLoading: false,
      error: null,

      // Actions
      loadBusinesses: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await getBusinesses(userId);
          if (error) throw new Error(error);
          set({ businesses: data || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load businesses' });
        } finally {
          set({ isLoading: false });
        }
      },

      loadActiveBusiness: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });

          // Get user preferences
          const { data: prefs } = await getUserPreferences(userId);

          if (prefs?.active_business_id) {
            // Load the active business
            const { data: business, error } = await getBusiness(prefs.active_business_id);
            if (error) throw new Error(error);
            set({ activeBusiness: business });

            // Load voice agent for this business
            if (business) {
              await get().loadVoiceAgent(business.id);
            }
          } else {
            // No active business set, try to use first one
            const businesses = get().businesses;
            if (businesses.length > 0) {
              await get().setActiveBusiness(userId, businesses[0].id);
            }
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to load active business' });
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveBusiness: async (userId: string, businessId: string) => {
        try {
          set({ isLoading: true, error: null });

          // Update in database
          const { error: dbError } = await setActiveBusinessDB(userId, businessId);
          if (dbError) throw new Error(dbError);

          // Load the business
          const { data: business, error } = await getBusiness(businessId);
          if (error) throw new Error(error);
          set({ activeBusiness: business });

          // Load voice agent
          if (business) {
            await get().loadVoiceAgent(business.id);
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to set active business' });
        } finally {
          set({ isLoading: false });
        }
      },

      addBusiness: async (userId: string, config: BusinessConfig) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await createBusiness(userId, config);
          if (error) throw new Error(error);

          if (data) {
            // Add to list
            set((state) => ({ businesses: [data, ...state.businesses] }));

            // Set as active
            await get().setActiveBusiness(userId, data.id);

            return { businessId: data.id, error: null };
          }

          return { businessId: null, error: 'Failed to create business' };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add business';
          set({ error: message });
          return { businessId: null, error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      updateCurrentBusiness: async (updates: Partial<BusinessConfig>) => {
        const activeBusiness = get().activeBusiness;
        if (!activeBusiness) return { error: 'No active business' };

        try {
          set({ isLoading: true, error: null });

          const { error } = await updateBusiness(activeBusiness.id, updates);
          if (error) throw new Error(error);

          // Reload the business
          const { data } = await getBusiness(activeBusiness.id);
          if (data) {
            set({ activeBusiness: data });
            // Update in list
            set((state) => ({
              businesses: state.businesses.map((b) =>
                b.id === data.id ? data : b
              ),
            }));
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update business';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCurrentBusiness: async (userId: string) => {
        const activeBusiness = get().activeBusiness;
        if (!activeBusiness) return { error: 'No active business' };

        try {
          set({ isLoading: true, error: null });

          const { error } = await deleteBusiness(activeBusiness.id);
          if (error) throw new Error(error);

          // Remove from list
          const newBusinesses = get().businesses.filter((b) => b.id !== activeBusiness.id);
          set({ businesses: newBusinesses, activeBusiness: null, activeVoiceAgent: null });

          // Set another business as active if available
          if (newBusinesses.length > 0) {
            await get().setActiveBusiness(userId, newBusinesses[0].id);
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete business';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      loadVoiceAgent: async (businessId: string) => {
        try {
          const { data, error } = await getVoiceAgent(businessId);
          if (error) {
            console.warn('No voice agent found:', error);
            set({ activeVoiceAgent: null });
          } else {
            set({ activeVoiceAgent: data });
          }
        } catch (error) {
          console.error('Error loading voice agent:', error);
          set({ activeVoiceAgent: null });
        }
      },

      saveVoiceAgent: async (businessId: string, agentData: any) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await createVoiceAgent(businessId, agentData);
          if (error) throw new Error(error);

          set({ activeVoiceAgent: data });
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save voice agent';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      updateCurrentVoiceAgent: async (updates: any) => {
        const activeVoiceAgent = get().activeVoiceAgent;
        if (!activeVoiceAgent) return { error: 'No active voice agent' };

        try {
          set({ isLoading: true, error: null });

          const { error } = await updateVoiceAgent(activeVoiceAgent.id, updates);
          if (error) throw new Error(error);

          // Reload
          const activeBusiness = get().activeBusiness;
          if (activeBusiness) {
            await get().loadVoiceAgent(activeBusiness.id);
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update voice agent';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      getActiveBusinessConfig: () => {
        const activeBusiness = get().activeBusiness;
        if (!activeBusiness) return null;

        const activeVoiceAgent = get().activeVoiceAgent;
        const config = businessToConfig(activeBusiness);

        // Add voice agent info if available
        if (activeVoiceAgent) {
          config.voiceAgent = {
            name: activeVoiceAgent.name,
            personality: activeVoiceAgent.personality || '',
            systemPrompt: activeVoiceAgent.system_prompt || '',
            firstMessage: activeVoiceAgent.first_message || '',
          };
        }

        return config;
      },

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          businesses: [],
          activeBusiness: null,
          activeVoiceAgent: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'business-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist IDs for quick restore
        activeBusinessId: state.activeBusiness?.id,
      }),
    }
  )
);

// Selector hooks
export const useBusinesses = () => useBusinessStore((state) => state.businesses);
export const useActiveBusiness = () => useBusinessStore((state) => state.activeBusiness);
export const useActiveVoiceAgent = () => useBusinessStore((state) => state.activeVoiceAgent);
export const useBusinessLoading = () => useBusinessStore((state) => state.isLoading);
export const useBusinessError = () => useBusinessStore((state) => state.error);
