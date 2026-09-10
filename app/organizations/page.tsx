"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import { useMode } from "@/lib/use-mode";
import { organizations as mockOrgs } from "@/lib/mock-data";
import { getAllOrganizations } from "@/lib/supabase/queries";

type Row = { slug: string; name: string; type: string };

function OrganizationsList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      setRows(Object.values(mockOrgs).map((o) => ({ slug: o.slug, name: o.name, type: o.type })));
      return;
    }
    if (mode.status === "real") {
      getAllOrganizations().then((orgs) => setRows(orgs.map((o) => ({ slug: o.id, name: o.name, type: o.type }))));
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[40px] leading-[1.15] text-oxblood mb-9">Organizations</h1>
      <div className="flex flex-col">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">No organizations yet.</div>}
        {rows?.map((o, i) => (
          <Link
            key={o.slug}
            href={`/organizations/${o.slug}`}
            className={`flex justify-between items-baseline py-4.5 border-t border-rule ${
              i === rows.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="font-serif font-medium text-[18px] text-oxblood">{o.name}</span>
            <span className="text-[13px] text-muted capitalize">{o.type}</span>
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
