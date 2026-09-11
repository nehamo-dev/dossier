"use client";

import { useState } from "react";

export default function ConnectionCard({
  name,
  description,
  action = "connect",
  isLast,
}: {
  name: string;
  description: string;
  action?: "connect" | "upload";
  isLast?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "clicked">("idle");

  return (
    <div className={`py-4 border-t border-rule ${isLast ? "border-b" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-serif font-medium text-[17px] text-oxblood">{name}</div>
          <div className="text-[13px] text-ink-soft mt-0.5">{description}</div>
        </div>

        <button
          onClick={() => setStatus("clicked")}
          className="shrink-0 border border-rule text-ink-soft text-[11px] tracking-[0.05em] uppercase px-3 py-1.5 rounded-[3px] hover:border-oxblood hover:text-oxblood transition-colors"
        >
          {action === "upload" ? "Upload export" : "Connect"}
        </button>
      </div>

      {status === "clicked" && (
        <div className="text-[12px] text-muted mt-2.5">
          {action === "upload"
            ? "File upload isn't wired up yet — this is a placeholder for a future manual-import flow."
            : "OAuth isn't wired up yet — this needs API credentials set up first, same as the Supabase connection was."}
        </div>
      )}
    </div>
  );
}
