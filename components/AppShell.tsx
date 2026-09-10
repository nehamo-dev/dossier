"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { getDossierMode } from "@/lib/mode";
import TopNav from "./TopNav";
import DossiAIBar from "./DossiAIBar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const [demoMode, setDemoModeState] = useState<boolean | null>(null);

  useEffect(() => {
    setDemoModeState(getDossierMode() === "demo");
  }, []);

  const showChrome = !loading && demoMode !== null && (!!session || demoMode);

  return (
    <>
      {showChrome && <TopNav mode={session ? "real" : "demo"} />}
      {showChrome && <DossiAIBar />}
      <main className="flex-1">{children}</main>
    </>
  );
}
