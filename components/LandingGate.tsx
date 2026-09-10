"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ALLOWED_REAL_EMAIL } from "@/lib/auth-context";
import { setDemoMode } from "@/lib/mode";

export default function LandingGate() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setStatus("sending");
    const { error } = await signIn();
    if (error) {
      setError(error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  function handleDemo() {
    setDemoMode();
    router.refresh();
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[380px] w-full text-center">
        <div className="font-serif italic font-semibold text-[26px] text-oxblood mb-2">Dossier</div>
        <div className="text-[15px] text-ink-soft mb-12">Your professional network, with memory.</div>

        {status === "sent" ? (
          <div className="border border-rule px-6 py-5 text-[14px] text-ink-soft leading-relaxed">
            Check <span className="text-ink font-medium">{ALLOWED_REAL_EMAIL}</span> for a sign-in link.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignIn}
              disabled={status === "sending"}
              className="border border-oxblood text-oxblood text-[13px] tracking-[0.05em] uppercase py-3 hover:bg-oxblood hover:text-white transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Sign in"}
            </button>
            <button
              onClick={handleDemo}
              className="border border-rule text-ink-soft text-[13px] tracking-[0.05em] uppercase py-3 hover:border-ink hover:text-ink transition-colors"
            >
              View demo
            </button>
            {status === "error" && <div className="text-[12px] text-link mt-2">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
