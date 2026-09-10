"use client";

import { useEffect, useState } from "react";
import { useMode } from "@/lib/use-mode";
import { people as mockPeople } from "@/lib/mock-data";
import {
  getAllPeople,
  getAllLinks,
  getAllOrganizations,
  getAllInteractions,
  getAllSources,
  sourceLabel,
  shortDate,
} from "@/lib/supabase/queries";

type TimelineRow = { title: string; date: string; body?: string; source?: string; tier: 1 | 2 | 3 };
type PersonView = {
  name: string;
  title: string;
  strength: string | null;
  narrative: string | null;
  linkedOrgs: { name: string; role: string }[];
  timeline: TimelineRow[];
  lowSignalCount: number;
};

export default function PersonDetail({ slug }: { slug: string }) {
  const mode = useMode();
  const [person, setPerson] = useState<PersonView | null | undefined>(undefined);

  useEffect(() => {
    if (mode.status === "demo") {
      const p = mockPeople[slug];
      if (!p) {
        setPerson(null);
        return;
      }
      setPerson({
        name: p.name,
        title: p.title,
        strength: p.strength,
        narrative: p.narrative,
        linkedOrgs: p.linkedOrgs,
        timeline: p.timeline.filter((t) => t.tier < 3),
        lowSignalCount: p.lowSignalCount ?? 0,
      });
      return;
    }

    if (mode.status === "real") {
      Promise.all([getAllPeople(), getAllLinks(), getAllOrganizations(), getAllInteractions(), getAllSources()]).then(
        ([people, links, orgs, interactions, sources]) => {
          const p = people.find((x) => x.id === slug);
          if (!p) {
            setPerson(null);
            return;
          }

          const orgById = new Map(orgs.map((o) => [o.id, o]));
          const sourceById = new Map(sources.map((s) => [s.id, s]));

          const linkedOrgs = links
            .filter((l) => l.person_id === slug)
            .map((l) => ({ name: orgById.get(l.organization_id)?.name ?? l.organization_id, role: l.role ?? "" }));

          const personInteractions = interactions
            .filter((i) => i.person_id === slug)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const timeline: TimelineRow[] = personInteractions
            .filter((i) => (i.meaningfulness_tier ?? 3) < 3)
            .map((i) => ({
              title: i.title ?? i.interaction_type ?? "Interaction",
              date: shortDate(i.date),
              body: i.description ?? undefined,
              source: sourceLabel(sourceById.get(i.source_id ?? "")) ?? undefined,
              tier: (i.meaningfulness_tier as 1 | 2 | 3) ?? 2,
            }));

          const lowSignalCount = personInteractions.filter((i) => (i.meaningfulness_tier ?? 3) >= 3).length;

          setPerson({
            name: p.name,
            title: p.title ?? "",
            strength: personInteractions.length
              ? `${personInteractions.length} interaction${personInteractions.length === 1 ? "" : "s"} logged`
              : null,
            narrative: null,
            linkedOrgs,
            timeline,
            lowSignalCount,
          });
        }
      );
    }
  }, [mode.status, slug]);

  if (person === undefined) {
    return <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24 text-[13px] text-muted">Loading…</div>;
  }

  if (person === null) {
    return (
      <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
        <div className="text-[15px] text-ink-soft">No one found at this address.</div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <div className="text-[12px] text-muted mb-4.5">People &nbsp;/&nbsp; {person.name}</div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif font-medium text-[42px] leading-[1.1] text-oxblood">{person.name}</h1>
          <div className="text-[16px] text-ink-soft mt-1.5">{person.title}</div>
        </div>
        {person.strength && (
          <div className="border border-link rounded-[3px] px-3.5 py-1.5 mt-1.5 whitespace-nowrap">
            <span className="text-[11px] tracking-[0.06em] uppercase text-link">{person.strength}</span>
          </div>
        )}
      </div>

      {person.narrative && (
        <p className="text-[16px] leading-relaxed text-ink-soft my-7 max-w-[640px]">{person.narrative}</p>
      )}

      {person.linkedOrgs.length > 0 && (
        <div className="mb-11 mt-7">
          <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-3.5">Linked organizations</div>
          <div className="flex gap-3 flex-wrap">
            {person.linkedOrgs.map((org) => (
              <div key={org.name} className="border border-rule px-4 py-2.5">
                <div className="text-[14px] text-ink font-semibold">{org.name}</div>
                {org.role && <div className="text-[12px] text-muted mt-0.5">{org.role}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-5">Timeline</div>
        <div className="flex flex-col">
          {person.timeline.length === 0 && <div className="text-[13px] text-muted py-4">Nothing logged yet.</div>}
          {person.timeline.map((entry, i) => (
            <div key={`${entry.title}-${i}`} className={`border-t border-rule ${entry.tier === 1 ? "py-5.5" : "py-4.5"}`}>
              <div className="flex justify-between items-baseline">
                <div className={entry.tier === 1 ? "text-[15.5px] font-semibold text-ink" : "text-[14px] text-ink-soft"}>
                  {entry.title}
                </div>
                <div className="text-[12px] text-muted">{entry.date}</div>
              </div>
              {entry.body && (
                <div className="text-[14.5px] text-ink-soft leading-relaxed mt-1.5 max-w-[600px]">{entry.body}</div>
              )}
              {entry.source && <div className="text-[11px] text-faint mt-2 italic">{entry.source}</div>}
            </div>
          ))}

          {person.lowSignalCount > 0 && (
            <div className="border-t border-b border-rule py-4">
              <div className="text-[13px] text-muted">
                + {person.lowSignalCount} lower-signal touchpoints — calendar holds, list emails
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
