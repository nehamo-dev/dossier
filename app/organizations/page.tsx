"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
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
          strength: strengthTier(interactionCount),
          latest: latest ? { date: latest.date, sortDate: latest.date, title: latest.title, withNames: latest.withNames } : null,
        };
      });
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
          <Link
            key={o.slug}
            href={`/organizations/${o.slug}`}
            className={`flex items-start justify-between gap-4 py-4 px-2 -mx-2 rounded-[4px] border-t border-rule hover:bg-[#faf7f2] transition-colors ${
              i === rows.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-medium text-[17px] text-oxblood">{o.name}</span>
                <span className="text-[12px] text-muted capitalize">{o.type}</span>
              </div>
              {o.description && <div className="text-[13px] text-ink-soft mt-0.5 truncate">{o.description}</div>}
              {o.latest && (
                <div className="text-[12.5px] mt-1.5 truncate">
                  <span className="text-link">{o.latest.date}</span>{" "}
                  <span className="font-semibold text-ink">{o.latest.title}</span>{" "}
                  <span className="text-muted">· with {o.latest.withNames}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              {o.strength && (
                <span
                  className={`text-[10px] tracking-[0.05em] uppercase border rounded-[3px] px-2 py-0.5 whitespace-nowrap ${
                    o.strength === "Strong" ? "border-link text-link" : "border-[#a08a63] text-[#a08a63]"
                  }`}
                >
                  {o.strength}
                </span>
              )}
              {o.interactionCount > 0 && (
                <span className="text-[11px] text-muted whitespace-nowrap">
                  {o.interactionCount} interaction{o.interactionCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </Link>
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
