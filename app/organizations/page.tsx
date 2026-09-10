"use client";

import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import RelationshipCard from "@/components/RelationshipCard";
import { useMode } from "@/lib/use-mode";
import { organizations as mockOrgs } from "@/lib/mock-data";
import { getAllOrganizations, getAllInteractions, getAllPeople, shortDate, strengthTier } from "@/lib/supabase/queries";

type Row = {
  slug: string;
  name: string;
  type: string;
  description: string;
  interactionCount: number;
  strength: "Strong" | "Warm" | null;
  latest: { date: string; sortDate: string; title: string; withNames: string } | null;
};

function joinNames(names: string[]): string {
  if (names.length <= 2) return names.join(", ");
  return `${names[0]} and ${names.length - 1} others`;
}

function OrganizationsList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      const computed: Row[] = Object.values(mockOrgs).map((o) => {
        const countMatch = o.status.match(/(\d+)\s+interaction/i);
        const interactionCount = countMatch ? Number(countMatch[1]) : o.sharedTimeline.length;
        const latest = o.sharedTimeline[0];
        return {
          slug: o.slug,
          name: o.name,
          type: o.type,
          description: o.description,
          interactionCount,
          strength: o.strength,
          latest: latest ? { date: latest.date, sortDate: latest.date, title: latest.title, withNames: latest.withNames } : null,
        };
      });
      computed.sort((a, b) => (a.latest && b.latest ? new Date(b.latest.sortDate).getTime() - new Date(a.latest.sortDate).getTime() : 0));
      setRows(computed);
      return;
    }

    if (mode.status === "real") {
      Promise.all([getAllOrganizations(), getAllInteractions(), getAllPeople()]).then(([orgs, interactions, people]) => {
        const personById = new Map(people.map((p) => [p.id, p]));

        const computed: Row[] = orgs.map((o) => {
          const orgInteractions = interactions
            .filter((i) => i.organization_id === o.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          let latest: Row["latest"] = null;
          if (orgInteractions.length > 0) {
            const top = orgInteractions[0];
            const sameEvent = orgInteractions.filter((i) => i.date === top.date && i.title === top.title);
            const names = sameEvent.map((i) => personById.get(i.person_id)?.name).filter((n): n is string => !!n);
            latest = {
              date: shortDate(top.date),
              sortDate: top.date,
              title: top.title ?? top.interaction_type ?? "Interaction",
              withNames: joinNames(names),
            };
          }

          return {
            slug: o.id,
            name: o.name,
            type: o.type,
            description: o.description ?? "",
            interactionCount: orgInteractions.length,
            strength: strengthTier(orgInteractions.length),
            latest,
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
      <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-oxblood">Organizations</h1>
      {rows && (
        <div className="text-[13px] text-muted mt-1.5 mb-2">
          {rows.length} organization{rows.length === 1 ? "" : "s"} · sorted by latest activity
        </div>
      )}

      <div className="flex flex-col mt-6">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">No organizations yet.</div>}
        {rows?.map((o, i) => (
          <RelationshipCard
            key={o.slug}
            href={`/organizations/${o.slug}`}
            name={o.name}
            subtitle={o.type}
            description={o.description}
            metaLine={
              o.latest && (
                <>
                  <span className="text-link">{o.latest.date}</span>{" "}
                  <span className="font-semibold text-ink">{o.latest.title}</span>{" "}
                  <span className="text-muted">· with {o.latest.withNames}</span>
                </>
              )
            }
            badge={o.strength ? { label: o.strength, tone: o.strength === "Strong" ? "strong" : "warm" } : null}
            meta={o.interactionCount > 0 ? `${o.interactionCount} interaction${o.interactionCount === 1 ? "" : "s"}` : undefined}
            isLast={i === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function OrganizationsIndexPage() {
  return (
    <RequireAccess>
      <OrganizationsList />
    </RequireAccess>
  );
}
