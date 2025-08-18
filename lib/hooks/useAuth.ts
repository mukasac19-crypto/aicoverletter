// lib/hooks/useAuth/useAuth.ts
"use client";


import { useAuthStore,AuthState } from "@/stores/authstore";

import { shallow } from "zustand/shallow"; // Import shallow for comparison

// Optional: A custom hook to simplify consumption (similar to your old useAuth)
// This allows you to select only the parts of the store you need
export const useAuth = (): Pick<
  AuthState,
  | "user"
  | "session"
  | "impersonated"
  | "loading"
  | "signIn"
  | "signUp"
  | "signInWithProvider"
  | "resetPassword"
  | "updatePassword"
  | "signOut"
  | "exitImpersonation"
> => {
  // Select all necessary parts of the store.
  // Using shallow comparison for object properties to prevent unnecessary re-renders
  const { 
    user, 
    session, 
    impersonated, 
    loading, 
    signIn, 
    signUp, 
    signInWithProvider, 
    resetPassword, 
    updatePassword, 
    signOut, 
    exitImpersonation 
  } = useAuthStore(
    (state: AuthState) => ({
      user: state.user,
      session: state.session,
      impersonated: state.impersonated,
      loading: state.loading,
      signIn: state.signIn,
      signUp: state.signUp,
      signInWithProvider: state.signInWithProvider,
      resetPassword: state.resetPassword,
      updatePassword: state.updatePassword,
      signOut: state.signOut,
      exitImpersonation: state.exitImpersonation,
    }),
   
  );

  return { 
    user, 
    session, 
    impersonated, 
    loading, 
    signIn, 
    signUp, 
    signInWithProvider, 
    resetPassword, 
    updatePassword, 
    signOut, 
    exitImpersonation 
  };
};

// You might also want a separate hook for a single value:
// export const useUser = () => useAuthStore((state) => state.user);
// export const useSession = () => useAuthStore((state) => state.session);
// export const useAuthLoading = () => useAuthStore((state) => state.loading);
