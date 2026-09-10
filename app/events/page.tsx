"use client";

import { useEffect, useState } from "react";
import RequireAccess from "@/components/RequireAccess";
import RelationshipCard from "@/components/RelationshipCard";
import { useMode } from "@/lib/use-mode";
import { events as mockEvents } from "@/lib/mock-data";
import { getAllEvents, shortDate, joinNames } from "@/lib/supabase/queries";

type Row = { slug: string; title: string; date: string; location: string | null; description: string | null; attendees: string | null };

function EventsList() {
  const mode = useMode();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (mode.status === "demo") {
      setRows(
        mockEvents.map((e) => ({
          slug: e.slug,
          title: e.title,
          date: e.date,
          location: e.location ?? null,
          description: e.description ?? null,
          attendees: e.attendees ?? null,
        }))
      );
      return;
    }

    if (mode.status === "real") {
      getAllEvents().then((events) =>
        setRows(
          events.map((e) => ({
            slug: e.id,
            title: e.title,
            date: shortDate(e.event_date),
            location: e.location,
            description: e.description,
            attendees: e.attendees
              ? joinNames(
                  e.attendees.split(",").map((n) => n.trim()),
                  3
                )
              : null,
          }))
        )
      );
    }
  }, [mode.status]);

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-oxblood">Networking Events</h1>
      {rows && (
        <div className="text-[13px] text-muted mt-1.5 mb-2">
          {rows.length} event{rows.length === 1 ? "" : "s"}
        </div>
      )}

      <div className="flex flex-col mt-6">
        {rows === null && <div className="text-[13px] text-muted py-5">Loading…</div>}
        {rows?.length === 0 && <div className="text-[13px] text-muted py-5">Nothing logged yet.</div>}
        {rows?.map((e, i) => (
          <RelationshipCard
            key={e.slug}
            name={e.title}
            subtitle={e.location ?? undefined}
            description={e.description ?? undefined}
            metaLine={e.attendees && <span className="text-muted">with {e.attendees}</span>}
            meta={e.date}
            isLast={i === rows.length - 1}
          />
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
