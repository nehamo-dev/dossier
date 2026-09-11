# QA checklist

Manual checklist for verifying Dossier before considering a change done. Run the relevant section after touching that area. Check both **demo mode** and **real mode** unless noted — they run different code paths (`lib/mock-data.ts` vs. live Supabase queries) and a bug in one won't show up in the other.

---

## Setup for real-mode testing

- [ ] `supabase/migrations/0001_v1_schema.sql` has been run in the real Supabase project
- [ ] `supabase/migrations/0002_events.sql` has been run (safe to re-run)
- [ ] `data/phase0/load.sql` has been run (organizations, people, interactions, sources)
- [ ] `data/events/load.sql` has been run (networking events)
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_REAL_URL` / `NEXT_PUBLIC_SUPABASE_REAL_ANON_KEY` set
- [ ] Vercel has the same two env vars set, and a deploy has run *after* they were added (Next.js bakes `NEXT_PUBLIC_*` vars in at build time — adding them alone doesn't update an already-built deploy)

---

## Auth & mode gating

- [ ] Visiting `/` while signed out and not in demo mode shows the landing gate (Sign in / View demo) — no nav, no DossiAI bar
- [ ] "Sign in" sends a real magic link to neha.monga@gmail.com and shows the "check your email" confirmation state
- [ ] Clicking the magic link signs you in and lands on the real dashboard (not stuck on localhost, not "Invalid API key")
- [ ] "View demo" shows the Demo badge next to the wordmark and unlocks the full nav
- [ ] Visiting any route directly (`/people`, `/events`, etc.) while signed out and not in demo mode redirects to `/`
- [ ] "Sign out" (real mode) returns you to the gate; the real data is not visible afterward
- [ ] "Exit demo" (demo mode) returns you to the gate; demo content is not visible afterward
- [ ] Clicking the "Dossier" wordmark from any page returns to `/`

## Home

- [ ] Header shows "Signed in · neha.monga@gmail.com" (real) or "Demo mode" (demo)
- [ ] "Worth reconnecting" shows 3 people, sorted by longest gap since last interaction (real) or the curated list (demo)
- [ ] "Organizations to catch up with" shows 3 orgs, same sorting logic, separate from the people section
- [ ] "Recent activity" shows the latest interactions with correct date/title/source formatting
- [ ] All three sections show a "Loading…" state briefly, not a flash of empty content
- [ ] Clicking a person or org card navigates to its detail page

## People

- [ ] `/people` index lists everyone, sorted by latest activity, with badge + interaction count matching the detail page
- [ ] Real mode: all 10 people from the discovery pass appear
- [ ] Demo mode: all 5 fabricated people appear
- [ ] Clicking a card opens `/people/[slug]` with narrative (demo only — real mode has no narrative field), linked organizations, and timeline
- [ ] Timeline shows Tier 1/2 entries expanded, Tier 3 collapsed into a single "+N lower-signal touchpoints" line
- [ ] A nonexistent slug (`/people/does-not-exist`) shows the "no one found" state, not a crash

## Organizations

- [ ] `/organizations` index shows all orgs as condensed cards: name + type, truncated description, latest-activity line, Strong/Warm badge + interaction count
- [ ] Real mode: all 5 real orgs appear (Products That Count, Product School, Product Faculty, The Skip, Product Led Alliance)
- [ ] Demo mode: all 6 fabricated orgs appear
- [ ] Clicking a card opens the detail page with roster and shared timeline
- [ ] Roster entries link to the correct person page

## Events

- [ ] Page heading reads "Networking Events"; the nav item still reads "Events"
- [ ] Real mode: shows events loaded from `data/events/load.sql` (118 if loaded fresh), each with date, and where available, location/description/attendees ("with X, Y, Z", capped at 3)
- [ ] Demo mode: shows the 10 fabricated events
- [ ] No raw URLs appear in the location field (should be filtered out, not just any real address)

## Reconnect

- [ ] Full list (not capped at 3) matches Home's "Worth reconnecting" ordering logic
- [ ] Each row shows quiet-time, reason, and source tag

## Cross-cutting

- [ ] `npm run build` exits clean with 0 TypeScript errors
- [ ] No console errors on any page beyond the dev-only HMR websocket noise
- [ ] Responsive: nav collapses to a horizontally scrollable strip below 640px, no layout breakage
- [ ] Every card style (Home, People, Organizations, Reconnect, Events) looks visually consistent — same font sizes, badge treatment, spacing

## Known non-bugs (don't file these as issues)

- Real mode shows no narrative paragraph on person pages, and no "Strong/Warm" qualitative labels beyond the simple interaction-count threshold in `strengthTier()` — Phase 4's real scoring engine doesn't exist yet.
- "Worth reconnecting" / "Organizations to catch up with" in real mode is a recency-gap heuristic, not a considered recommendation.
- Demo mode never touches Supabase — that's intentional (see `docs/build-plan.md`'s 2026-09-10 decision), not a missing feature.
