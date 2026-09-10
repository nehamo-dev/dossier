"use client";

import { useEffect, useState } from "react";
import RelationshipCard from "@/components/RelationshipCard";
import { useMode } from "@/lib/use-mode";
import { reconnectSuggestions as mockReconnect } from "@/lib/mock-data";
import { getAllPeople, getAllInteractions, daysSince, shortDate, quietForLabel } from "@/lib/supabase/queries";

type Row = { slug: string; name: string; title: string; quietFor: string; reason: string };

export default function ReconnectList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      setRows(
        mockReconnect.map((p) => ({
          slug: p.slug,
          name: p.name,
          title: p.title,
          quietFor: p.quietFor,
          reason: p.reason,
        }))
      );
      return;
    }

    if (mode.status === "real") {
      Promise.all([getAllPeople(), getAllInteractions()]).then(([people, interactions]) => {
        const personById = new Map(people.map((p) => [p.id, p]));

        const latestByPerson = new Map<string, (typeof interactions)[number]>();
        for (const i of interactions) {
          const existing = latestByPerson.get(i.person_id);
          if (!existing || new Date(i.date) > new Date(existing.date)) latestByPerson.set(i.person_id, i);
        }

        const computed = Array.from(latestByPerson.entries())
          .map(([personId, interaction]) => {
            const person = personById.get(personId);
            if (!person) return null;
            const gapDays = daysSince(interaction.date);
            return {
              slug: person.id,
              name: person.name,
              title: person.title ?? "",
              quietFor: quietForLabel(gapDays),
              reason: `Last interaction: ${interaction.title ?? interaction.interaction_type}, ${shortDate(interaction.date)} — ${gapDays} days ago.`,
              gapDays,
            };
          })
          .filter((r): r is Row & { gapDays: number } => r !== null)
          .sort((a, b) => b.gapDays - a.gapDays)
          .map(({ gapDays: _gapDays, ...rest }) => rest);

        setRows(computed);
      });
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[40px] leading-[1.15] text-oxblood">Reconnect</h1>
      <p className="text-[16px] text-ink-soft mt-2.5 max-w-[520px]">
        People worth a few minutes this month — grounded in what&apos;s actually changed, not a guess.
      </p>

      <div className="flex flex-col mt-9">
        {rows === null && <div className="text-[13px] text-muted py-7">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-7">Nothing logged yet.</div>}
        {rows?.map((p, i) => (
          <RelationshipCard
            key={p.slug}
            href={`/people/${p.slug}`}
            name={p.name}
            subtitle={p.title}
            description={p.reason}
            meta={p.quietFor}
            isLast={i === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
