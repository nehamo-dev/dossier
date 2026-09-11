// Converts the filtered Banana-event pull (data/events/banana-events-full.jsonl)
// into SQL INSERT statements for the events table. Paste output into the
// Supabase SQL Editor (bypasses RLS, same pattern as Phase 0).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "../data/events/banana-events-full.jsonl");
const lines = readFileSync(inputPath, "utf-8").trim().split("\n").filter(Boolean);

const SELF_EMAIL = "neha.monga@gmail.com";
const NON_HUMAN_ATTENDEE = /goodtime sync|resource\.calendar\.google\.com|calendar-notification@google\.com/i;
const BOILERPLATE_MARKERS = /powered by calendly|zoom meeting|join with google meet|meeting id|one tap mobile|youcanbook\.me|hangout\.me/i;

// Conferences and group meetups only — no 1:1s. Built by reviewing every
// title (and description, for the ambiguous ones) in the Banana pull by
// hand; not a keyword guess. Matched by exact title after entity-decoding.
const GROUP_EVENT_TITLES = new Set([
  "Time to Tell a Different Story",
  "Rapid-Fire Insights on Funding & Scaling Your Startup with Ben Nahir",
  "Executive Roundtable - Seattle",
  "Why You're Not Getting Promoted (and What You Can Do About It)",
  "Pitch Please",
  "Seattle CPO Happy Hour",
  "LogRocket Product Leader Networking Dinner",
  "Product-Led Summit | Seattle",
  "Panel Session",
  "Skip Coach Live: The Death of the PRD -- From Static Docs to AI-Powered Building",
  "Products That Count: Q3 Advisory Council Welcome Session",
  "Skip Coach Live: Ask the Maker from Figma Make",
  "2025 IA Summit Welcome Reception",
  "2025 IA Summit",
  "Skip Coach Live: The Power Pivot - Leader to Hands-On IC",
  "Asian Women Summit 2026",
]);

function sql(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toDateOnly(iso) {
  return iso.slice(0, 10);
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanDescription(raw) {
  if (!raw) return null;
  let text = decodeEntities(raw)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const firstUseful = text.find((line) => line.length > 15 && !BOILERPLATE_MARKERS.test(line));
  if (!firstUseful) return null;

  const trimmed = firstUseful.length > 160 ? `${firstUseful.slice(0, 157)}...` : firstUseful;
  return trimmed;
}

function cleanAttendees(attendees, organizerEmail) {
  if (!Array.isArray(attendees)) return [];
  return attendees
    .map((a) => a.displayName || a.email)
    .filter((name) => name && name.toLowerCase() !== SELF_EMAIL && name.toLowerCase() !== (organizerEmail ?? "").toLowerCase())
    .filter((name) => !NON_HUMAN_ATTENDEE.test(name));
}

const seen = new Set();
const rows = [];
for (const line of lines) {
  const ev = JSON.parse(line);
  const title = decodeEntities((ev.summary ?? "(untitled)").trim());
  if (!GROUP_EVENT_TITLES.has(title)) continue;

  const id = `evt-${ev.id}`;
  if (seen.has(id)) continue;
  seen.add(id);

  const attendeeNames = cleanAttendees(ev.attendees, ev.organizer?.email);

  const rawLocation = ev.location ?? null;
  const location = rawLocation && !/^https?:\/\//i.test(rawLocation) ? rawLocation : null;

  rows.push({
    id,
    title,
    event_date: toDateOnly(ev.start?.dateTime ?? ev.start?.date),
    location,
    description: cleanDescription(ev.description),
    attendees: attendeeNames.length ? attendeeNames.join(", ") : null,
    external_id: ev.id,
  });
}

const lines_out = [
  "-- Generated from data/events/banana-events-full.jsonl — run in the Supabase SQL Editor.",
  "-- Idempotent: safe to re-run, existing ids are skipped via ON CONFLICT.",
  "",
  ...rows.map(
    (r) =>
      `insert into events (id, title, event_date, location, description, attendees, external_id) values (${sql(r.id)}, ${sql(r.title)}, ${sql(r.event_date)}, ${sql(r.location)}, ${sql(r.description)}, ${sql(r.attendees)}, ${sql(r.external_id)})\n  on conflict (id) do nothing;`
  ),
  "",
];

const outPath = join(__dirname, "../data/events/load.sql");
writeFileSync(outPath, lines_out.join("\n"));
console.log(`wrote ${outPath} (${rows.length} events)`);
