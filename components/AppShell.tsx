"use client";

import type { ReactNode } from "react";
import { useMode } from "@/lib/use-mode";
import TopNav from "./TopNav";
import DossiAIBar from "./DossiAIBar";

export default function AppShell({ children }: { children: ReactNode }) {
  const mode = useMode();
  const showChrome = mode.status === "real" || mode.status === "demo";

  return (
    <>
      {showChrome && <TopNav mode={mode.status === "real" ? "real" : "demo"} />}
      {showChrome && <DossiAIBar />}
      <main className="flex-1">{children}</main>
    </>
  );
}
