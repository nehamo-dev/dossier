"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "@/lib/use-mode";

// Gate for every route except the landing page itself. Real session or
// demo mode required — anything else bounces to "/" to choose one.
export default function RequireAccess({ children }: { children: ReactNode }) {
  const mode = useMode();
  const router = useRouter();

  useEffect(() => {
    if (mode.status === "gate") router.replace("/");
  }, [mode.status, router]);

  if (mode.status !== "real" && mode.status !== "demo") return null;
  return <>{children}</>;
}
