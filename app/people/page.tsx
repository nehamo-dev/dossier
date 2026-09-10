"use client";

import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import RelationshipCard from "@/components/RelationshipCard";
import { useMode } from "@/lib/use-mode";
import { people as mockPeople } from "@/lib/mock-data";
import { getAllPeople, getAllInteractions, shortDate, strengthTier } from "@/lib/supabase/queries";

type Row = {
  slug: string;
  name: string;
  title: string;
  description: string;
  interactionCount: number;
  strength: "Strong" | "Warm" | null;
  latest: { date: string; sortDate: string; title: string } | null;
};

function PeopleList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      const computed: Row[] = Object.values(mockPeople).map((p) => {
        const [label] = p.strength.split(" ");
        const countMatch = p.strength.match(/(\d+)\s+interaction/i);
        const interactionCount = countMatch ? Number(countMatch[1]) : p.timeline.length;
        const latest = p.timeline[0];
        return {
          slug: p.slug,
          name: p.name,
          title: p.title,
          description: p.narrative,
          interactionCount,
          strength: label === "Strong" || label === "Warm" ? label : null,
          latest: latest ? { date: latest.date, sortDate: latest.date, title: latest.title } : null,
        };
      });
      computed.sort((a, b) => (a.latest && b.latest ? new Date(b.latest.sortDate).getTime() - new Date(a.latest.sortDate).getTime() : 0));
      setRows(computed);
      return;
    }

    if (mode.status === "real") {
      Promise.all([getAllPeople(), getAllInteractions()]).then(([people, interactions]) => {
        const computed: Row[] = people.map((p) => {
          const personInteractions = interactions
            .filter((i) => i.person_id === p.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const top = personInteractions[0];
          return {
            slug: p.id,
            name: p.name,
            title: p.title ?? "",
            description: "",
            interactionCount: personInteractions.length,
            strength: strengthTier(personInteractions.length),
            latest: top
              ? { date: shortDate(top.date), sortDate: top.date, title: top.title ?? top.interaction_type ?? "Interaction" }
              : null,
          };
        });

        computed.sort((a, b) => {
          if (!a.latest) return 1;
          if (!b.latest) return -1;
          return new Date(b.latest.sortDate).getTime() - new Date(a.latest.sortDate).getTime();
        });

        setRows(computed);
      });
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-oxblood">People</h1>
      {rows && (
        <div className="text-[13px] text-muted mt-1.5 mb-2">
          {rows.length} {rows.length === 1 ? "person" : "people"} · sorted by latest activity
        </div>
      )}

      <div className="flex flex-col mt-6">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">No one here yet.</div>}
        {rows?.map((p, i) => (
          <RelationshipCard
            key={p.slug}
            href={`/people/${p.slug}`}
            name={p.name}
            subtitle={p.title}
            description={p.description}
            metaLine={
              p.latest && (
                <>
                  <span className="text-link">{p.latest.date}</span>{" "}
                  <span className="font-semibold text-ink">{p.latest.title}</span>
                </>
              )
            }
            badge={p.strength ? { label: p.strength, tone: p.strength === "Strong" ? "strong" : "warm" } : null}
            meta={p.interactionCount > 0 ? `${p.interactionCount} interaction${p.interactionCount === 1 ? "" : "s"}` : undefined}
            isLast={i === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function PeopleIndexPage() {
  return (
    <RequireAccess>
      <PeopleList />
    </RequireAccess>
  );
}
