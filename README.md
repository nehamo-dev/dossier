# Dossier

*Your professional network, with memory.*

A private, single-user professional relationship intelligence tool — not a CRM. It answers:

- Who do I know, and how do I know them?
- What organizations connect us?
- What's my history with this organization or person?
- Who should I reconnect with, and why?

Organizations are the primary entity in v1. Contacts are people linked to one or more organizations, not a general address book — if it's not tied to an organization that matters, it's not in scope yet.

## Two data stores, locked from day one

- **Real data** — a dedicated Supabase project, populated only from Gmail / Calendar / Granola via MCP, gated to a single known user.
- **Demo data** — a fully separate Supabase project, seeded once with fabricated (but realistic) people, orgs, and relationship narratives. No ingestion pipeline ever writes to it.

Full details in [`docs/build-plan.md`](docs/build-plan.md).

## Status

Pre-Phase 0. UX direction has been previewed and approved; no ingestion, auth, or data model has been built yet.

## Non-negotiables

- Real and demo data never share a Supabase project, schema, or query path.
- Never commit `.env`, OAuth tokens, or exported email/calendar/Granola data. Repo stays private.
- Ingestion is read-only, always — never sends email, creates calendar events, or modifies Gmail/Calendar/Granola.
- Every AI-derived claim traces to a source with a date; low-confidence claims go to a review queue, never presented as fact.
