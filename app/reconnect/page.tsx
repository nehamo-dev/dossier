import Link from "next/link";
import { reconnectSuggestions } from "@/lib/mock-data";
import RequireAccess from "@/components/RequireAccess";

export default function ReconnectPage() {
  return (
    <RequireAccess>
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[40px] leading-[1.15] text-oxblood">Reconnect</h1>
      <p className="text-[16px] text-ink-soft mt-2.5 max-w-[520px]">
        People worth a few minutes this month — grounded in what&apos;s actually changed, not a guess.
      </p>

      <div className="flex flex-col mt-11">
        {reconnectSuggestions.map((p, i) => (
          <div
            key={p.slug}
            className={`py-7 border-t border-rule ${i === reconnectSuggestions.length - 1 ? "border-b" : ""}`}
          >
            <div className="flex justify-between items-baseline">
              <Link href={`/people/${p.slug}`} className="font-serif font-medium text-[21px] text-oxblood">
                {p.name}
              </Link>
              <div className="text-[12px] text-muted">{p.quietFor}</div>
            </div>
            <div className="text-[13px] text-muted mt-0.5 mb-3">{p.title}</div>
            <div className="text-[15px] text-ink-soft leading-relaxed max-w-[600px]">{p.reason}</div>
            <div className="text-[11px] text-faint mt-2.5 italic">{p.source}</div>
          </div>
        ))}
      </div>
    </div>
    </RequireAccess>
  );
}
