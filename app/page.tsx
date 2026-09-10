"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getDossierMode } from "@/lib/mode";
import LandingGate from "@/components/LandingGate";
import DashboardHome from "@/components/DashboardHome";

export default function HomePage() {
  const { session, loading } = useAuth();
  const [demoMode, setDemoModeState] = useState<boolean | null>(null);

  useEffect(() => {
    setDemoModeState(getDossierMode() === "demo");
  }, []);

  if (loading || demoMode === null) return null;
  if (session) return <DashboardHome mode="real" />;
  if (demoMode) return <DashboardHome mode="demo" />;
  return <LandingGate />;
}
