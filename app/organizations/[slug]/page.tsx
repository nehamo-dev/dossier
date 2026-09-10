import Link from "next/link";
import { notFound } from "next/navigation";
import { organizations } from "@/lib/mock-data";
import RequireAccess from "@/components/RequireAccess";

export default async function OrganizationPage({ params }: PageProps<"/organizations/[slug]">) {
  const { slug } = await params;
  const org = organizations[slug];
  if (!org) notFound();

  return (
    <RequireAccess>
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <div className="text-[12px] text-muted mb-4.5">Organizations &nbsp;/&nbsp; {org.name}</div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif font-medium text-[42px] leading-[1.1] text-oxblood">{org.name}</h1>
          <div className="text-[16px] text-ink-soft mt-1.5">{org.type}</div>
        </div>
        <div className="border border-link rounded-[3px] px-3.5 py-1.5 mt-1.5 whitespace-nowrap">
          <span className="text-[11px] tracking-[0.06em] uppercase text-link">{org.status}</span>
        </div>
      </div>

      <p className="text-[16px] leading-relaxed text-ink-soft my-7 max-w-[640px]">{org.description}</p>

      <div className="mb-12">
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-4.5">People here</div>
        <div className="flex flex-col">
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
                <div className="text-[13px] text-muted my-0.5 mb-1.5">{person.title}</div>
                <div className="text-[13.5px] text-ink-soft">{person.snippet}</div>
              </div>
              <span
                className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap mt-1 ${
                  person.strength === "Strong" ? "text-link" : "text-[#a08a63]"
                }`}
              >
                {person.strength}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-4.5">Shared timeline</div>
        <div className="flex flex-col gap-5">
          {org.sharedTimeline.map((entry) => (
            <div key={entry.title} className="flex gap-5">
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
    </RequireAccess>
  );
}
