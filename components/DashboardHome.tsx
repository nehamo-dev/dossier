import Link from "next/link";
import { reconnectSuggestions, activityFeed } from "@/lib/mock-data";

export default function DashboardHome({ mode }: { mode: "real" | "demo" }) {
  const preview = reconnectSuggestions.slice(0, 3);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-18 pb-24">
      <section className="mb-16">
        <div className="text-[11px] tracking-[0.06em] uppercase text-muted mb-2">
          {mode === "demo" ? "Demo mode" : "Signed in · neha.monga@gmail.com"}
        </div>
        <h1 className="font-serif font-medium text-[46px] leading-[1.15] text-oxblood">Good morning.</h1>
        <p className="text-[17px] text-ink-soft mt-2.5 max-w-[480px]">
          Here&apos;s who&apos;s worth a few minutes today, and what&apos;s happened since you last looked.
        </p>
      </section>

      <section className="mb-15">
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-[11px] tracking-[0.08em] uppercase text-muted">Worth reconnecting</span>
          <Link href="/reconnect" className="text-[12px]">
            View all →
          </Link>
        </div>

        <div className="flex flex-col">
          {preview.map((p, i) => (
            <div
              key={p.slug}
              className={`flex justify-between items-start py-5 border-t border-rule ${
                i === preview.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="max-w-[500px]">
                <Link href={`/people/${p.slug}`} className="font-serif font-medium text-[19px] text-oxblood block">
                  {p.name}
                </Link>
                <div className="text-[13px] text-muted mt-0.5 mb-2">{p.title}</div>
                <div className="text-[14px] text-ink-soft leading-relaxed">{p.reason}</div>
              </div>
              <Link href={`/people/${p.slug}`} className="text-[12px] whitespace-nowrap mt-1">
                View story →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-5">Recent activity</div>

        <div className="flex flex-col gap-5">
          {activityFeed.map((a) => (
            <div key={a.title} className="flex gap-5">
              <div className="w-[84px] shrink-0 text-[12px] text-muted pt-0.5">{a.date}</div>
              <div>
                <div className="text-[14.5px] text-ink">
                  <span className="font-semibold">{a.title}</span> · {a.context}
                </div>
                <div className="text-[13.5px] text-ink-soft mt-0.5 leading-relaxed">{a.body}</div>
                <div className="text-[11px] text-faint mt-1 italic">{a.source}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
