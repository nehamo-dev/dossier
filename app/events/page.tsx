"use client";

import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import { useMode } from "@/lib/use-mode";
import { events as mockEvents } from "@/lib/mock-data";
import { getAllEvents, shortDate } from "@/lib/supabase/queries";

type Row = { slug: string; title: string; date: string; location: string | null };

function EventsList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      setRows(mockEvents.map((e) => ({ slug: e.slug, title: e.title, date: e.date, location: e.location ?? null })));
      return;
    }

    if (mode.status === "real") {
      getAllEvents().then((events) =>
        setRows(events.map((e) => ({ slug: e.id, title: e.title, date: shortDate(e.event_date), location: e.location })))
      );
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-oxblood">Events</h1>
      {rows && (
        <div className="text-[13px] text-muted mt-1.5 mb-2">
          {rows.length} networking event{rows.length === 1 ? "" : "s"}
        </div>
      )}

      <div className="flex flex-col mt-6">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">Nothing logged yet.</div>}
        {rows?.map((e, i) => (
          <div
            key={e.slug}
            className={`flex items-baseline justify-between gap-4 py-4 px-2 -mx-2 border-t border-rule ${
              i === rows.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="min-w-0">
              <span className="font-serif font-medium text-[17px] text-oxblood">{e.title}</span>
              {e.location && <div className="text-[13px] text-ink-soft mt-0.5 truncate">{e.location}</div>}
            </div>
            <span className="text-[12px] text-muted shrink-0 whitespace-nowrap">{e.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <RequireAccess>
      <EventsList />
    </RequireAccess>
  );
}
