# CONTEXT — Phased Build Doc

**Working name:** Context (alt: Thread)
**Tagline:** Your professional network, with memory.

This document is the build plan for Claude Code. It supersedes any "build everything then polish" sequencing — the priority order here is: **real data early, beautiful UI early, narrow scope, two isolated data stores (real vs. demo).**

---

## 0. Product Vision (unchanged from original spec)

A private, single-user professional relationship intelligence tool — not a CRM. It answers:

- Who do I know, and how do I know them?
- What organizations connect us?
- What's my history with this organization or person?
- Who should I reconnect with, and why?

The magic is the *context* around a relationship, not the contact record itself.

**Scope for v1 (explicit narrowing):** Organizations are the primary entity. Contacts are people linked to one or more organizations — not a general "everyone on LinkedIn" address book. If it's not tied to an organization you care about, it's not in scope yet.

---

## 1. Core Design Principle

Every person has a **relationship story**, not a contact card:

> **Jane Smith** — CPO, Acme
> Worked together at Meta. Reconnected through Products That Count. Last meaningful interaction: dinner, Seattle, May 2026.
> **Strong · 7 interactions**

Full guidance on visual language, IA (Home / People / Organizations / Activity / Thought Leadership / Reconnect / Your Story / Search), person/org page layout, activity tiering (Tier 1 in-person/dinner/keynote > Tier 2 substantive email/panel > Tier 3 admin/calendar noise), and the "never hallucinate, always show evidence" AI principle all carry over from the original spec unchanged. Reference that doc for exact copy/layout examples when building screens.

---

## 2. Two Data Stores — Locked Before Any Code

This is the most important structural decision and it must be right from Phase 0, not retrofitted.

### Real data (yours)
- Its own Supabase project.
- Populated only from your real Gmail / Calendar / Granola via MCP.
- Auth: Supabase email magic-link, restricted to your email address only (hardcode the allowed email or gate via RLS on a single known user ID — not open signup).
- Never seeded, mocked, or touched by demo logic.

### Demo data (public-facing)
- Fabricated but realistic: invented names, orgs, and relationship narratives with the same shape as real data (same org types, same story structure) — never "Person 1 / Company A" placeholders.
- No auth required — anonymous "View demo" access.

**Decision (2026-09-10), superseding the original "fully separate Supabase project" plan below:** demo data lives as static content in the app's own code (`lib/mock-data.ts`), never in Supabase at all. Demo mode makes zero database calls, so there is no RLS policy to get wrong and no shared table to leak from — a stronger guarantee than a second Supabase project would give, at a fraction of the setup cost. Deliberately simpler than what's described next; kept for the record, not as the active plan.

<details>
<summary>Original plan (not what's built)</summary>

- A **fully separate Supabase project** — not a schema flag, not a shared table with an `is_demo` column. Full separation means a broken RLS policy or a copy-pasted query can never leak real data.
- Seeded **once**, via a one-time script. No ingestion pipeline, no cron job, no MCP connector ever writes to it. Read-only from the app's perspective after seeding.

</details>

### App routing
The frontend picks which Supabase project/client to talk to based on whether the visitor is authenticated as you or browsing anonymously. This must be two distinct client instances configured by environment, not one query path that branches on a flag. A landing screen offers **"Sign in"** (you) vs. **"View demo"** (everyone else).

---

## 3. Data Model (v1, org-centric)

Deliberately smaller than the original 9-table spec. Add tables back in later phases only when a real need shows up.

```
organizations
  id, name, type (employer | community | conference | podcast | other),
  domain, website, linkedin_url, description,
  relationship_strength, created_at, updated_at

people
  id, name, first_name, last_name, email, secondary_emails,
  title, linkedin_url, location, avatar_url, notes,
  relationship_strength, relationship_status,
  created_at, updated_at

org_person_links   -- many-to-many, since people span orgs over time
  id, person_id, organization_id, role, start_date, end_date,
  link_type (worked_together | community_member | speaker | attendee | other),
  confidence, evidence_source_id

interactions
  id, person_id, organization_id (nullable), interaction_type,
  date, title, description, meaningfulness_tier (1|2|3),
  source_id, location, confidence

sources
  id, source_type (gmail | calendar | granola | manual),
  external_id, external_url, source_date, ingestion_run_id

ingestion_runs
  id, source, started_at, completed_at,
  records_discovered, records_created, records_updated,
  duplicates, review_required, status
```

**Deferred to later phases (not v1):** `thought_leadership`, `follow_up_tasks`, standalone `work_history` (folded into `org_person_links` for now), separate analytics tables.

**Design note baked in from the start:** `org_person_links` is many-to-many by design — a person can be linked to Meta *and* Products That Count *and* HubSpot. Don't let the UI assume one owning organization per person.

---

## 4. Phased Build Plan

### Phase 0 — Real data pull, no UI (fast, ~days not weeks)
- Inspect available MCP connections (Gmail, Google Calendar, Granola). Do not assume tool names — discover what's actually connected.
- Pick 5–8 organizations that matter most (e.g. Meta, HubSpot, Lattice, Products That Count, Women in Product).
- Read-only discovery pass, scoped to people/events tied to those orgs only.
- Write raw-but-structured rows into the **real** Supabase project using the v1 schema above.
- No design work yet.

**Checkpoint:** Look at the actual rows. Does "worked with Jane at Meta, reconnected via Products That Count" show up cleanly, or is the data messier than expected (aliases, noisy calendar titles, group invites)? Fix ingestion logic here, before any UI exists.

### Phase 1 — Beautiful UI, rendering real data
- Build the actual editorial UI: ivory/near-black/single-accent visual language, org pages, person pages, relationship timelines, the network view.
- Render against the real (small, 5–8 org) dataset from Phase 0 — not synthetic, not hand-typed.
- Apply activity tiering in the UI now, not later — a timeline dominated by admin emails will immediately expose a design flaw a fake dataset would have hidden.

**Checkpoint:** This is a screen you'd actually open and enjoy using, even though it only covers a handful of organizations.

### Phase 2a — Auth hardening (your mode)
- Lock the real Supabase project behind email-gated magic-link auth restricted to you specifically.
- Confirm: no path exists where real data is reachable without authentication as you.

### Phase 2b — Demo mode (isolated) — done, simplified per the 2026-09-10 decision above
- Demo dataset lives in `lib/mock-data.ts` — no second Supabase project. Realistic relationship narratives, timelines, and reconnect-style copy — same shape as real data, invented content.
- No seeding step needed — it's checked into the app, not a database.
- Landing route built: Sign in vs. View demo (`components/LandingGate.tsx`), gating every route via `lib/use-mode.ts` + `RequireAccess`.

**Checkpoint:** A stranger can open the demo and get the full experience without ever touching or risking your real data — true by construction, since demo mode never calls Supabase.

### Phase 3 — Widen ingestion (real data only)
- Repeat the Phase 0 pipeline across your remaining organizations.
- Build entity resolution and the review queue for real duplicates/uncertain matches (confirmed / inferred / suggested confidence tiers, merge/reject UI).
- This is the highest-effort phase — budget accordingly. Small scope through Phase 0–2 was specifically to delay this cost until the UI and auth are already solid.

**Checkpoint:** Ingestion report numbers are trustworthy; merging a real duplicate actually works end to end.

### Phase 4 — Intelligence layer (real data only)
- Relationship strength scoring, evidence-linked.
- Reconnect engine with explainable recommendations.
- Natural-language search across people/orgs/interactions, answers grounded in evidence with source references — never an unsupported summary.

**Checkpoint:** "Who should I reconnect with" produces answers you'd actually act on.

### Phase 5 — Extras (real data only, cut freely if time is short)
- Thought Leadership tracking (speaking, podcasts, panels).
- Analytics (network growth, activity by type/org/year, career-chapter view).
- "Your Story" visual career timeline.
- Mobile/tablet responsiveness pass (desktop remains primary).

### Phase 6 — Continuous sync
- Turn Phase 3's ingestion into a scheduled, resumable job against the real Supabase project only.
- Demo project is explicitly excluded from any scheduled job, permanently.

---

## 5. Non-Negotiables (carry through every phase)

- Real and demo data never share a Supabase project, schema, or query path.
- Never commit `.env`, OAuth tokens, or any exported email/calendar/Granola data to GitHub. Repo stays private.
- Never send an email, create a calendar event, or modify Gmail/Calendar/Granola during ingestion — read-only, always.
- Every AI-derived claim must trace to a source (Gmail / Calendar / Granola / manual) with a date. If confidence is low, it goes to a review queue — never silently presented as fact.
- Full ingestion history stays inspectable and reversible: you can correct, delete, merge, and re-run safely.

---

## 6. Definition of Done (v1)

You can:
1. Open the app and understand your professional network across your chosen organizations.
2. See exactly how you know someone, and your shared history with an org.
3. See a real, evidence-backed relationship timeline per person and per org.
4. Get reconnect suggestions with explainable reasons.
5. Search naturally across people/orgs/interactions.
6. Correct, merge, or delete records, and re-run ingestion safely.
7. Share a public demo link that never exposes your real data.
8. Genuinely want to open it every week.
