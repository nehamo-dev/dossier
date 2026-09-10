"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getDossierMode } from "@/lib/mode";

// Gate for every route except the landing page itself. Real session or
// demo mode required — anything else bounces to "/" to choose one.
export default function RequireAccess({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;
    const mode = getDossierMode();
    if (session || mode === "demo") {
      setAllowed(true);
    } else {
      router.replace("/");
    }
    setChecked(true);
  }, [loading, session, router]);

  if (!checked || !allowed) return null;
  return <>{children}</>;
}
