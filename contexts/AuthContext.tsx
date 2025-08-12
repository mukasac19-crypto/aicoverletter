//C:\Users\mukas\Downloads\project-bolt-sb1-guerg2d9\project\contexts\AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Session, User, Provider, AuthResponse, OAuthResponse, AuthError, UserResponse } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  impersonated: boolean;
  exitImpersonation: () => Promise<void>;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signInWithProvider: (provider: Provider) => Promise<OAuthResponse>;
  resetPassword: (email: string) => Promise<{ data: {}; error: null; } | { data: null; error: AuthError; }>;
  updatePassword: (password: string) => Promise<UserResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [impersonated, setImpersonated] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(window.location.origin,"====================ccc===========>>>")

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login?message=Check your email to confirm your account.`,
      },
    });
  };

  const signInWithProvider = (provider: Provider) => {
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const resetPassword = (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
  };

  const updatePassword = (password: string) => {
    return supabase.auth.updateUser({ password });
  };
  
  const signOut = () => {
    return supabase.auth.signOut();
  };
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user?.email) {
            const { data: tokenData, error } = await supabase
              .from('impersonation_tokens')
              .select('id, expires_at, used_at')
              .eq('email', session.user.email)
              .is('used_at', null)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (tokenData && new Date(tokenData.expires_at) > new Date()) {
              setImpersonated(true);
            } else {
              setImpersonated(false);
            }
        } else {
          setImpersonated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const exitImpersonation = async () => {
    await fetch('/api/oslo/auth/exit-impersonation', { method: 'POST' });
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, session, impersonated, exitImpersonation, loading, signIn, signUp, signInWithProvider, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}