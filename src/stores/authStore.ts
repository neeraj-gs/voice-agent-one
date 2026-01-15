/**
 * Authentication Store
 * Manages user authentication state with Supabase
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase, Profile } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (session) {
            set({ user: session.user, session });
            await get().fetchProfile();
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            set({ user: session?.user || null, session });

            if (session?.user) {
              await get().fetchProfile();
            } else {
              set({ profile: null });
            }
          });

        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to initialize auth' });
        } finally {
          set({ isLoading: false, isInitialized: true });
        }
      },

      signUp: async (email: string, password: string, fullName?: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            set({ user: data.user, session: data.session });
          }

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign up failed';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({ user: data.user, session: data.session });
          await get().fetchProfile();

          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: message });
          return { error: message };
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          set({ user: null, session: null, profile: null });
        } catch (error) {
          console.error('Sign out error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const user = get().user;
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          set({ profile: data });
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const user = get().user;
        if (!user) return { error: 'Not authenticated' };

        try {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

          if (error) throw error;

          await get().fetchProfile();
          return { error: null };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Update failed';
          return { error: message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist minimal auth state
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// Selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useProfile = () => useAuthStore((state) => state.profile);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.session);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
