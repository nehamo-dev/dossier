"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { clearDemoMode } from "@/lib/mode";

const NAV_ITEMS: { label: string; href: string | null; match: string | null }[] = [
  { label: "Home", href: "/", match: "/" },
  { label: "People", href: "/people", match: "/people" },
  { label: "Organizations", href: "/organizations", match: "/organizations" },
  { label: "Events", href: "/events", match: "/events" },
  { label: "Reconnect", href: "/reconnect", match: "/reconnect" },
  { label: "Your Story", href: null, match: null },
];

export default function TopNav({ mode }: { mode: "real" | "demo" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleExit() {
    if (mode === "real") {
      await signOut();
    } else {
      clearDemoMode();
      window.location.reload();
    }
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-16 py-4 sm:py-6.5 border-b border-rule">
      <div className="flex items-baseline gap-3.5 shrink-0">
        <span className="font-serif italic font-semibold text-[21px] tracking-[0.01em] text-oxblood">
          Dossier
        </span>
        {mode === "demo" && (
          <span className="text-[10px] tracking-[0.08em] uppercase text-muted border border-rule px-1.5 py-0.5 rounded-[3px]">
            Demo
          </span>
        )}
      </div>

      <nav className="flex items-center gap-5 sm:gap-8 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match === "/" ? pathname === "/" : !!item.match && pathname.startsWith(item.match);

          if (!item.href) {
            return (
              <span key={item.label} className="shrink-0 text-[12px] tracking-[0.05em] uppercase text-muted/50">
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`shrink-0 text-[12px] tracking-[0.05em] uppercase pb-[3px] ${
                isActive ? "text-ink border-b border-link" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a4238" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.2" y2="16.2" />
        </svg>

        <button onClick={handleExit} className="shrink-0 text-[12px] text-muted hover:text-ink">
          {mode === "real" ? "Sign out" : "Exit demo"}
        </button>
      </nav>
    </div>
  );
}
