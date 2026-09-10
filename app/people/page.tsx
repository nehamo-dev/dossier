"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import { useMode } from "@/lib/use-mode";
import { people as mockPeople } from "@/lib/mock-data";
import { getAllPeople } from "@/lib/supabase/queries";

type Row = { slug: string; name: string; title: string };

function PeopleList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      setRows(Object.values(mockPeople).map((p) => ({ slug: p.slug, name: p.name, title: p.title })));
      return;
    }
    if (mode.status === "real") {
      getAllPeople().then((people) => setRows(people.map((p) => ({ slug: p.id, name: p.name, title: p.title ?? "" }))));
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[40px] leading-[1.15] text-oxblood mb-9">People</h1>
      <div className="flex flex-col">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">No one here yet.</div>}
        {rows?.map((p, i) => (
          <Link
            key={p.slug}
            href={`/people/${p.slug}`}
            className={`flex justify-between items-baseline py-4.5 border-t border-rule ${
              i === rows.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="font-serif font-medium text-[18px] text-oxblood">{p.name}</span>
            <span className="text-[13px] text-muted">{p.title}</span>
          </Link>
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
