// stores/authStore.ts
"use client"

import { create } from 'zustand';
import initSupabase, { createClient } from '@/utils/client-side-client';
import { Session, User, Provider, AuthResponse, OAuthResponse, AuthError, UserResponse } from '@supabase/supabase-js';

// Initialize the Supabase client outside of the store definition
// This ensures it's created only once and is stable across renders.
// const supabase = createClient();
const supabase = initSupabase

// Define the shape of your Zustand store state
export interface AuthState {
  user: User | null;
  session: Session | null;
  impersonated: boolean;
  loading: boolean;
  // Methods for interacting with authentication
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, options?: { redirectTo?: string }) => Promise<AuthResponse>;
  signInWithProvider: (provider: Provider, options?: { redirectTo?: string }) => Promise<OAuthResponse>;
  resetPassword: (email: string) => Promise<{ data: {}; error: null; } | { data: null; error: AuthError; }>;
  updatePassword: (password: string) => Promise<UserResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  exitImpersonation: () => Promise<void>;
  // Initialization function to set up listeners
  initializeAuth: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  impersonated: false,
  loading: true, // Initial loading state

  // Authentication methods that interact with Supabase
  signIn: async (email, password) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    // Update store state based on response, if needed (optional, as onAuthStateChange handles this)
    if (response.data.session) {
      set({ user: response.data.user, session: response.data.session });
    }
    return response;
  },

  signUp: async (email, password, options) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.redirectTo || `${window.location.origin}/auth/login?message=Check your email to confirm your account.`,
      },
    });
    // Update store state based on response
    if (response.data.session) {
      set({ user: response.data.user, session: response.data.session });
    }
    return response;
  },

  signInWithProvider: async (provider, options) => {
    const response = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:`${window.location.origin}/api/auth/callback`,
      },
    });
    // OAuth flow typically redirects, so no direct state update here from response
    return response;
  },

  resetPassword: async (email) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
  },

  updatePassword: async (password) => {
    const response = await supabase.auth.updateUser({ password });
    if (response.data.user) {
      set({ user: response.data.user });
    }
    return response;
  },
  
  signOut: async () => {
    const response = await supabase.auth.signOut();
    // Clear state on sign out
    set({ user: null, session: null, impersonated: false });
    return response;
  },

  exitImpersonation: async () => {
    // This action still interacts with your API endpoint
    await fetch('/api/oslo/auth/exit-impersonation', { method: 'POST' });
    // Reloading the window will re-trigger the initializeAuth logic
    // window.location.reload(); 
  },

  // Initialization function to set up the Supabase auth listener
  initializeAuth: () => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      set({ 
        session: initialSession, 
        user: initialSession?.user ?? null, 
        loading: false 
      });

      // After setting initial state, check impersonation if user exists
      if (initialSession?.user?.email) {
        supabase
          .from('impersonation_tokens')
          .select('id, expires_at, used_at')
          .eq('email', initialSession.user.email)
          .is('used_at', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
          .then(({ data: tokenData, error }) => {
            if (tokenData && new Date(tokenData.expires_at) > new Date()) {
              set({ impersonated: true });
            } else {
              set({ impersonated: false });
            }
            return null; // Ensure a real Promise is returned
          })

          //TODO Handle any error in fetching impersonation status
          
      } else {
        set({ impersonated: false });
      }
    });

    // Set up real-time auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        set({ 
          session: session, 
          user: session?.user ?? null, 
          loading: false 
        }); // Always update state and set loading to false

        if (session?.user?.email) {
          // Re-fetch impersonation status on auth state change
          const { data: tokenData, error } = await supabase
            .from('impersonation_tokens')
            .select('id, expires_at, used_at')
            .eq('email', session.user.email)
            .is('used_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (tokenData && new Date(tokenData.expires_at) > new Date()) {
            set({ impersonated: true });
          } else {
            set({ impersonated: false });
          }
        } else {
          set({ impersonated: false }); // Clear impersonation status if no user
        }
      }
    );

    // This cleanup will be handled by a useEffect in RootLayout
    // or wherever initializeAuth is called.
    // subscription.unsubscribe(); // Cannot return this directly here in Zustand store
  },
}));


