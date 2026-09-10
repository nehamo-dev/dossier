import Link from "next/link";
import type { ReactNode } from "react";

export type CardBadge = { label: string; tone: "strong" | "warm" };

export default function RelationshipCard({
  href,
  name,
  subtitle,
  description,
  metaLine,
  badge,
  meta,
  isLast,
}: {
  href: string;
  name: string;
  subtitle?: string;
  description?: string;
  metaLine?: ReactNode;
  badge?: CardBadge | null;
  meta?: string;
  isLast?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-start justify-between gap-4 py-4 px-2 -mx-2 rounded-[4px] border-t border-rule hover:bg-[#faf7f2] transition-colors ${
        isLast ? "border-b" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-medium text-[17px] text-oxblood truncate">{name}</span>
          {subtitle && <span className="text-[12px] text-muted shrink-0">{subtitle}</span>}
        </div>
        {description && <div className="text-[13px] text-ink-soft mt-0.5 truncate">{description}</div>}
        {metaLine && <div className="text-[12.5px] mt-1.5 truncate">{metaLine}</div>}
      </div>

      {(badge || meta) && (
        <div className="flex flex-col items-end gap-1 shrink-0">
          {badge && (
            <span
              className={`text-[10px] tracking-[0.05em] uppercase border rounded-[3px] px-2 py-0.5 whitespace-nowrap ${
                badge.tone === "strong" ? "border-link text-link" : "border-[#a08a63] text-[#a08a63]"
              }`}
            >
              {badge.label}
            </span>
          )}
          {meta && <span className="text-[11px] text-muted whitespace-nowrap">{meta}</span>}
        </div>
      )}
    </Link>
  );
}
