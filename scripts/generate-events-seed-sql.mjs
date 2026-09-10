// Converts the filtered Banana-event pull (data/events/banana-events-filtered.jsonl)
// into SQL INSERT statements for the events table. Paste output into the
// Supabase SQL Editor (bypasses RLS, same pattern as Phase 0).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "../data/events/banana-events-filtered.jsonl");
const lines = readFileSync(inputPath, "utf-8").trim().split("\n").filter(Boolean);

function sql(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toDateOnly(iso) {
  // Handles both full datetimes and all-day "date" values.
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

const seen = new Set();
const rows = [];
for (const line of lines) {
  const ev = JSON.parse(line);
  const id = `evt-${ev.id}`;
  if (seen.has(id)) continue;
  seen.add(id);
  rows.push({
    id,
    title: decodeEntities((ev.title ?? "(untitled)").trim()),
    event_date: toDateOnly(ev.start),
    location: ev.location ?? null,
    external_id: ev.id,
  });
}

const lines_out = [
  "-- Generated from data/events/banana-events-filtered.jsonl — run in the Supabase SQL Editor.",
  "-- Idempotent: safe to re-run, existing ids are skipped via ON CONFLICT.",
  "",
  ...rows.map(
    (r) =>
      `insert into events (id, title, event_date, location, external_id) values (${sql(r.id)}, ${sql(r.title)}, ${sql(r.event_date)}, ${sql(r.location)}, ${sql(r.external_id)})\n  on conflict (id) do nothing;`
  ),
  "",
];

const outPath = join(__dirname, "../data/events/load.sql");
writeFileSync(outPath, lines_out.join("\n"));
console.log(`wrote ${outPath} (${rows.length} events)`);
