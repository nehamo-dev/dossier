// Generates SQL INSERT statements from data/phase0/discovery.json.
// Output is meant to be pasted into the Supabase SQL Editor (runs as the
// Postgres owner, bypassing RLS) — same pattern as running the schema.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const discovery = JSON.parse(readFileSync(join(__dirname, "../data/phase0/discovery.json"), "utf-8"));

function sql(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function insertStatement(table, columns, row) {
  const values = columns.map((c) => sql(row[c])).join(", ");
  return `insert into ${table} (${columns.join(", ")}) values (${values})\n  on conflict (id) do nothing;`;
}

const lines = [];
lines.push("-- Generated from data/phase0/discovery.json — run in the Supabase SQL Editor.");
lines.push("-- Idempotent: safe to re-run, existing ids are skipped via ON CONFLICT.");
lines.push("");

lines.push("-- organizations");
for (const org of discovery.organizations) {
  lines.push(
    insertStatement("organizations", ["id", "name", "type", "domain", "website", "description"], org)
  );
}

lines.push("");
lines.push("-- people");
for (const person of discovery.people) {
  lines.push(
    insertStatement("people", ["id", "name", "first_name", "last_name", "email", "title"], person)
  );
}

lines.push("");
lines.push("-- org_person_links");
for (const link of discovery.org_person_links) {
  lines.push(
    insertStatement(
      "org_person_links",
      ["id", "person_id", "organization_id", "role", "link_type", "confidence", "evidence_source_id"],
      link
    )
  );
}

lines.push("");
lines.push("-- sources (before interactions, since interactions.source_id has no FK but logically depends on it)");
for (const source of discovery.sources) {
  lines.push(
    insertStatement(
      "sources",
      ["id", "source_type", "external_id", "source_date", "ingestion_run_id"],
      source
    )
  );
}

lines.push("");
lines.push("-- ingestion_runs");
for (const run of discovery.ingestion_runs) {
  lines.push(
    insertStatement(
      "ingestion_runs",
      [
        "id",
        "source",
        "started_at",
        "completed_at",
        "records_discovered",
        "records_created",
        "records_updated",
        "duplicates",
        "review_required",
        "status",
      ],
      run
    )
  );
}

lines.push("");
lines.push("-- interactions");
for (const interaction of discovery.interactions) {
  lines.push(
    insertStatement(
      "interactions",
      [
        "id",
        "person_id",
        "organization_id",
        "interaction_type",
        "date",
        "title",
        "description",
        "meaningfulness_tier",
        "source_id",
        "location",
        "confidence",
      ],
      interaction
    )
  );
}

const out = lines.join("\n") + "\n";
const outPath = join(__dirname, "../data/phase0/load.sql");
writeFileSync(outPath, out);
console.log(`wrote ${outPath} (${discovery.organizations.length} orgs, ${discovery.people.length} people, ${discovery.org_person_links.length} links, ${discovery.interactions.length} interactions, ${discovery.sources.length} sources, ${discovery.ingestion_runs.length} ingestion runs)`);
