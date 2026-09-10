"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reconnectSuggestions as mockReconnect, activityFeed as mockActivity } from "@/lib/mock-data";
import {
  getAllInteractions,
  getAllPeople,
  getAllSources,
  sourceLabel,
  shortDate,
  daysSince,
  quietForLabel,
} from "@/lib/supabase/queries";

type ReconnectRow = { slug: string; name: string; title: string; reason: string; quietFor: string };
type ActivityRow = { date: string; title: string; context: string; body: string; source: string };

export default function DashboardHome({ mode }: { mode: "real" | "demo" }) {
  const [reconnect, setReconnect] = useState<ReconnectRow[] | null>(null);
  const [activity, setActivity] = useState<ActivityRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "demo") {
      setReconnect(
        mockReconnect
          .slice(0, 3)
          .map((p) => ({ slug: p.slug, name: p.name, title: p.title, reason: p.reason, quietFor: p.quietFor }))
      );
      setActivity(
        mockActivity.map((a) => ({ date: a.date, title: a.title, context: a.context, body: a.body, source: a.source }))
      );
      return;
    }

    let cancelled = false;

    Promise.all([getAllPeople(), getAllInteractions(), getAllSources()])
      .then(([people, interactions, sources]) => {
        if (cancelled) return;

        const sourceById = new Map(sources.map((s) => [s.id, s]));
        const personById = new Map(people.map((p) => [p.id, p]));

        const activityRows: ActivityRow[] = interactions.slice(0, 6).map((i) => ({
          date: shortDate(i.date),
          title: i.title ?? i.interaction_type ?? "Interaction",
          context: personById.get(i.person_id)?.name ?? "",
          body: i.description ?? "",
          source: sourceLabel(sourceById.get(i.source_id ?? "")) ?? "",
        }));

        const latestByPerson = new Map<string, (typeof interactions)[number]>();
        for (const i of interactions) {
          const existing = latestByPerson.get(i.person_id);
          if (!existing || new Date(i.date) > new Date(existing.date)) latestByPerson.set(i.person_id, i);
        }

        const reconnectRows: ReconnectRow[] = Array.from(latestByPerson.entries())
          .map(([personId, interaction]) => {
            const person = personById.get(personId);
            if (!person) return null;
            const gapDays = daysSince(interaction.date);
            return {
              slug: person.id,
              name: person.name,
              title: person.title ?? "",
              reason: `Last interaction: ${interaction.title ?? interaction.interaction_type}, ${shortDate(interaction.date)} — ${gapDays} days ago.`,
              quietFor: quietForLabel(gapDays),
              gapDays,
            };
          })
          .filter((r): r is ReconnectRow & { gapDays: number } => r !== null)
          .sort((a, b) => b.gapDays - a.gapDays)
          .slice(0, 3)
          .map(({ gapDays: _gapDays, ...rest }) => rest);

        setReconnect(reconnectRows);
        setActivity(activityRows);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your data."));

    return () => {
      cancelled = true;
    };
  }, [mode]);

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

      {error && <div className="text-[13px] text-link mb-8">{error}</div>}

      <section className="mb-15">
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-[11px] tracking-[0.08em] uppercase text-muted">Worth reconnecting</span>
          <Link href="/reconnect" className="text-[12px]">
            View all →
          </Link>
        </div>

        <div className="flex flex-col">
          {reconnect === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
          {reconnect?.length === 0 && <div className="text-[13px] text-muted py-5">No interactions loaded yet.</div>}
          {reconnect?.map((p, i) => (
            <div
              key={p.slug}
              className={`flex justify-between items-start py-5 border-t border-rule ${
                i === reconnect.length - 1 ? "border-b" : ""
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
          {activity === null && <div className="text-[13px] text-muted">Loading…</div>}
          {activity?.length === 0 && <div className="text-[13px] text-muted">Nothing logged yet.</div>}
          {activity?.map((a, i) => (
            <div key={`${a.title}-${i}`} className="flex gap-5">
              <div className="w-[84px] shrink-0 text-[12px] text-muted pt-0.5">{a.date}</div>
              <div>
                <div className="text-[14.5px] text-ink">
                  <span className="font-semibold">{a.title}</span>
                  {a.context && ` · ${a.context}`}
                </div>
                {a.body && <div className="text-[13.5px] text-ink-soft mt-0.5 leading-relaxed">{a.body}</div>}
                {a.source && <div className="text-[11px] text-faint mt-1 italic">{a.source}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
