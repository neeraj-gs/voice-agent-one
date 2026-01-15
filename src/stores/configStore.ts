/**
 * Configuration Store
 * Manages all app configuration in localStorage using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BusinessConfig, APIKeys } from '../types';

interface ConfigStore {
  // State
  isSetupComplete: boolean;
  setupCompletedAt: string | null;
  business: BusinessConfig | null;
  apiKeys: APIKeys | null;

  // Actions
  setBusinessConfig: (config: BusinessConfig) => void;
  setAPIKeys: (keys: APIKeys) => void;
  completeSetup: () => void;
  resetSetup: () => void;
  updateBusinessField: <K extends keyof BusinessConfig>(
    field: K,
    value: BusinessConfig[K]
  ) => void;
  updateBranding: (branding: Partial<BusinessConfig['branding']>) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isSetupComplete: false,
      setupCompletedAt: null,
      business: null,
      apiKeys: null,

      // Set entire business config
      setBusinessConfig: (config) =>
        set({ business: config }),

      // Set API keys
      setAPIKeys: (keys) =>
        set({ apiKeys: keys }),

      // Mark setup as complete
      completeSetup: () =>
        set({
          isSetupComplete: true,
          setupCompletedAt: new Date().toISOString(),
        }),

      // Reset everything (start over)
      resetSetup: () =>
        set({
          isSetupComplete: false,
          setupCompletedAt: null,
          business: null,
          apiKeys: null,
        }),

      // Update single business field
      updateBusinessField: (field, value) => {
        const current = get().business;
        if (current) {
          set({
            business: { ...current, [field]: value },
          });
        }
      },

      // Update branding colors
      updateBranding: (branding) => {
        const current = get().business;
        if (current) {
          set({
            business: {
              ...current,
              branding: { ...current.branding, ...branding },
            },
          });
        }
      },
    }),
    {
      name: 'voice-agent-config',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isSetupComplete: state.isSetupComplete,
        setupCompletedAt: state.setupCompletedAt,
        business: state.business,
        apiKeys: state.apiKeys,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useIsSetupComplete = () => useConfigStore((s) => s.isSetupComplete);
export const useBusiness = () => useConfigStore((s) => s.business);
export const useAPIKeys = () => useConfigStore((s) => s.apiKeys);
export const useBranding = () => useConfigStore((s) => s.business?.branding);

// Get config outside of React components
export const getConfig = () => useConfigStore.getState();

// Check if setup is needed
export const needsSetup = () => !useConfigStore.getState().isSetupComplete;
