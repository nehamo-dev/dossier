"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getDossierMode } from "./mode";

export type ModeState =
  | { status: "loading" }
  | { status: "gate" }
  | { status: "real" }
  | { status: "demo" };

export function useMode(): ModeState {
  const { session, loading } = useAuth();
  const [demo, setDemo] = useState<boolean | null>(null);

  useEffect(() => {
    setDemo(getDossierMode() === "demo");
  }, []);

  if (loading || demo === null) return { status: "loading" };
  if (session) return { status: "real" };
  if (demo) return { status: "demo" };
  return { status: "gate" };
}
