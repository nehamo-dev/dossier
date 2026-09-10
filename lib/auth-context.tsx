"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseReal } from "./supabase/real";

// Single-user app — the only account this project will ever authenticate.
// Hardcoded deliberately, per the build plan's auth model (not open signup).
export const ALLOWED_REAL_EMAIL = "neha.monga@gmail.com";

type AuthState = {
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseReal.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabaseReal.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn() {
    try {
      const { error } = await supabaseReal.auth.signInWithOtp({
        email: ALLOWED_REAL_EMAIL,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return { error: error?.message ?? null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Could not reach the real Supabase project yet." };
    }
  }

  async function signOut() {
    await supabaseReal.auth.signOut();
  }

  return <AuthContext.Provider value={{ session, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
