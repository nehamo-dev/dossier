"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMode } from "@/lib/use-mode";
import { organizations as mockOrgs } from "@/lib/mock-data";
import { getAllOrganizations, getAllLinks, getAllPeople, getAllInteractions, shortDate } from "@/lib/supabase/queries";

type RosterRow = { slug: string; name: string; title: string; snippet: string; strength: string };
type TimelineRow = { date: string; title: string; withNames: string };
type OrgView = {
  name: string;
  type: string;
  status: string | null;
  description: string;
  roster: RosterRow[];
  sharedTimeline: TimelineRow[];
};

export default function OrganizationDetail({ slug }: { slug: string }) {
  const mode = useMode();
  const [org, setOrg] = useState<OrgView | null | undefined>(undefined);

  useEffect(() => {
    if (mode.status === "demo") {
      const o = mockOrgs[slug];
      if (!o) {
        setOrg(null);
        return;
      }
      setOrg({
        name: o.name,
        type: o.type,
        status: o.status,
        description: o.description,
        roster: o.roster,
        sharedTimeline: o.sharedTimeline,
      });
      return;
    }

    if (mode.status === "real") {
      Promise.all([getAllOrganizations(), getAllLinks(), getAllPeople(), getAllInteractions()]).then(
        ([orgs, links, people, interactions]) => {
          const o = orgs.find((x) => x.id === slug);
          if (!o) {
            setOrg(null);
            return;
          }

          const personById = new Map(people.map((p) => [p.id, p]));

          const orgLinks = links.filter((l) => l.organization_id === slug);
          const orgInteractions = interactions
            .filter((i) => i.organization_id === slug)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const interactionCountByPerson = new Map<string, number>();
          for (const i of orgInteractions) {
            interactionCountByPerson.set(i.person_id, (interactionCountByPerson.get(i.person_id) ?? 0) + 1);
          }

          const roster: RosterRow[] = orgLinks.map((l) => {
            const p = personById.get(l.person_id);
            const count = interactionCountByPerson.get(l.person_id) ?? 0;
            return {
              slug: l.person_id,
              name: p?.name ?? l.person_id,
              title: p?.title ?? "",
              snippet: l.role ?? "",
              strength: count > 0 ? `${count} interaction${count === 1 ? "" : "s"}` : l.confidence ?? "",
            };
          });

          const sharedTimeline: TimelineRow[] = orgInteractions.map((i) => ({
            date: shortDate(i.date),
            title: i.title ?? i.interaction_type ?? "Interaction",
            withNames: personById.get(i.person_id)?.name ?? i.person_id,
          }));

          setOrg({
            name: o.name,
            type: o.type,
            status: orgInteractions.length ? `${orgInteractions.length} interactions` : null,
            description: o.description ?? "",
            roster,
            sharedTimeline,
          });
        }
      );
    }
  }, [mode.status, slug]);

  if (org === undefined) {
    return <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24 text-[13px] text-muted">Loading…</div>;
  }

  if (org === null) {
    return (
      <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
        <div className="text-[15px] text-ink-soft">No organization found at this address.</div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <div className="text-[12px] text-muted mb-4.5">Organizations &nbsp;/&nbsp; {org.name}</div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif font-medium text-[42px] leading-[1.1] text-oxblood">{org.name}</h1>
          <div className="text-[16px] text-ink-soft mt-1.5">{org.type}</div>
        </div>
        {org.status && (
          <div className="border border-link rounded-[3px] px-3.5 py-1.5 mt-1.5 whitespace-nowrap">
            <span className="text-[11px] tracking-[0.06em] uppercase text-link">{org.status}</span>
          </div>
        )}
      </div>

      {org.description && (
        <p className="text-[16px] leading-relaxed text-ink-soft my-7 max-w-[640px]">{org.description}</p>
      )}

      <div className="mb-12 mt-7">
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-4.5">People here</div>
        <div className="flex flex-col">
          {org.roster.length === 0 && <div className="text-[13px] text-muted py-4">No one linked yet.</div>}
          {org.roster.map((person, i) => (
            <div
              key={person.slug}
              className={`flex justify-between items-start py-4.5 border-t border-rule ${
                i === org.roster.length - 1 ? "border-b" : ""
              }`}
            >
              <div>
                <Link href={`/people/${person.slug}`} className="font-serif font-medium text-[18px] text-oxblood block">
                  {person.name}
                </Link>
                {person.title && <div className="text-[13px] text-muted my-0.5 mb-1.5">{person.title}</div>}
                {person.snippet && <div className="text-[13.5px] text-ink-soft">{person.snippet}</div>}
              </div>
              {person.strength && (
                <span className="text-[11px] tracking-[0.05em] uppercase whitespace-nowrap mt-1 text-[#a08a63]">
                  {person.strength}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-4.5">Shared timeline</div>
        <div className="flex flex-col gap-5">
          {org.sharedTimeline.length === 0 && <div className="text-[13px] text-muted">Nothing logged yet.</div>}
          {org.sharedTimeline.map((entry, i) => (
            <div key={`${entry.title}-${i}`} className="flex gap-5">
              <div className="w-[90px] shrink-0 text-[12px] text-muted pt-0.5">{entry.date}</div>
              <div>
                <div className="text-[14.5px] text-ink font-semibold">{entry.title}</div>
                <div className="text-[13.5px] text-ink-soft mt-0.5">With {entry.withNames}.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
