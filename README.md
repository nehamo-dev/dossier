# Dossier

**Your professional network, with memory.**

**▶ Live demo: [dossier-theta.vercel.app](https://dossier-theta.vercel.app)** · choose *View demo*, no sign-in

---

## The idea

Your network is one of the most valuable things you've built over a career, and nothing holds it well. LinkedIn knows titles. A CRM knows deal stages. Neither remembers that you worked with Jane at Meta, reconnected through Products That Count, and last had a real conversation over dinner in Seattle in May.

Dossier is a private relationship intelligence tool, deliberately **not a CRM**. Every person gets a relationship story instead of a contact card:

> **Jane Smith** · CPO, Acme
> Worked together at Meta. Reconnected through Products That Count. Last meaningful interaction: dinner, Seattle, May 2026.
> **Strong · 7 interactions**

It answers four questions:

- Who do I know, and how do I know them?
- Which organizations connect us?
- What's my history with this person or company?
- Who should I reconnect with, and why?

## What's built

- **Organizations first.** Org pages show everyone you know there, your shared history and a "worth catching up" recommendation. People exist because they're tied to an organization that matters to you, not because they're in an address book.
- **People with context.** Person pages lead with the story of the relationship and a timeline of interactions, tiered by how meaningful they were: an in-person dinner or keynote outweighs a substantive email thread, which outweighs calendar noise.
- **Reconnect.** A list of people who've gone quiet, with how long it's been and the reason they're worth a message.
- **Events.** The conferences and meetups where your network actually gathers.
- **Data sources.** An About Me page showing what's connected (Gmail, Calendar, Granola) and what's been ingested.
- **DossiAI.** A command bar for "When did I last speak with Marcus?" (designed, wired up once ingestion lands).

## Trust is the architecture

A tool that reads your email has to earn that. Dossier is built around four non-negotiables:

1. **Real and demo data never meet.** The public demo runs entirely on fabricated-but-realistic data compiled into the app and makes **zero database calls**. There's no RLS policy to get wrong and no shared table to leak from, because the demo never connects to one. Real mode uses a separate Supabase client and is gated by magic-link auth locked to a single user.
2. **Ingestion is read-only.** It never sends an email, creates an event or modifies Gmail, Calendar or Granola.
3. **Every claim shows its evidence.** Each AI-derived fact traces to a dated source. Low-confidence matches go to a review queue instead of being presented as fact.
4. **Everything is reversible.** Ingestion runs are logged, so any import can be corrected, merged, deleted or re-run.

## Built in phases, real data first

The [build plan](docs/build-plan.md) inverts the usual order. Instead of designing against a fake dataset, Phase 0 pulls a small slice of **real** data (5–8 organizations) before any UI exists, because a timeline full of admin emails exposes design flaws that hand-typed data hides.

| Phase | | Status |
|---|---|---|
| 0 | Real data pull for a handful of orgs, v1 schema | Schema and real-mode wiring done |
| 1 | Editorial UI rendering that data | Done: home, orgs, people, reconnect, events |
| 2 | Single-user auth + isolated demo mode | Done |
| 3 | Wider ingestion, entity resolution, review queue | Next |
| 4 | Relationship scoring, explainable reconnect engine, grounded search | Planned |
| 5–6 | Career timeline, analytics, continuous sync | Planned |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, magic-link auth). The schema lives in `supabase/migrations/`: organizations, people, org-person links, interactions, sources, ingestion runs and events.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: only needed for real mode
npm run dev                  # http://localhost:3000
```

Demo mode works with no environment variables at all.
