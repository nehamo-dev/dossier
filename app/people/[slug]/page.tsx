import { notFound } from "next/navigation";
import { people } from "@/lib/mock-data";
import RequireAccess from "@/components/RequireAccess";

export default async function PersonPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const person = people[slug];
  if (!person) notFound();

  const tier1and2 = person.timeline.filter((t) => t.tier < 3);

  return (
    <RequireAccess>
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <div className="text-[12px] text-muted mb-4.5">People &nbsp;/&nbsp; {person.name}</div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif font-medium text-[42px] leading-[1.1] text-oxblood">{person.name}</h1>
          <div className="text-[16px] text-ink-soft mt-1.5">{person.title}</div>
        </div>
        <div className="border border-link rounded-[3px] px-3.5 py-1.5 mt-1.5 whitespace-nowrap">
          <span className="text-[11px] tracking-[0.06em] uppercase text-link">{person.strength}</span>
        </div>
      </div>

      <p className="text-[16px] leading-relaxed text-ink-soft my-7 max-w-[640px]">{person.narrative}</p>

      <div className="mb-11">
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-3.5">Linked organizations</div>
        <div className="flex gap-3 flex-wrap">
          {person.linkedOrgs.map((org) => (
            <div key={org.name} className="border border-rule px-4 py-2.5">
              <div className="text-[14px] text-ink font-semibold">{org.name}</div>
              <div className="text-[12px] text-muted mt-0.5">{org.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-5">Timeline</div>
        <div className="flex flex-col">
          {tier1and2.map((entry, i) => (
            <div key={entry.title} className={`border-t border-rule ${entry.tier === 1 ? "py-5.5" : "py-4.5"}`}>
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

          {person.lowSignalCount && (
            <div className="border-t border-b border-rule py-4">
              <div className="text-[13px] text-muted">
                + {person.lowSignalCount} lower-signal touchpoints — calendar holds, list emails
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </RequireAccess>
  );
}
