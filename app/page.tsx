"use client";

import { useMode } from "@/lib/use-mode";
import LandingGate from "@/components/LandingGate";
import DashboardHome from "@/components/DashboardHome";

export default function HomePage() {
  const mode = useMode();

  if (mode.status === "loading") return null;
  if (mode.status === "gate") return <LandingGate />;
  return <DashboardHome mode={mode.status} />;
}
