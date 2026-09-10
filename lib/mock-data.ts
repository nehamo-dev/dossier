// Fabricated sample data for the UI-only preview. No real relationships or
// interactions — this goes away once Phase 0 ingestion lands.

export type TimelineEntry = {
  title: string;
  date: string;
  body?: string;
  source?: string;
  tier: 1 | 2 | 3;
};

export type Person = {
  slug: string;
  name: string;
  title: string;
  org: string;
  strength: string;
  narrative: string;
  linkedOrgs: { name: string; role: string }[];
  timeline: TimelineEntry[];
  lowSignalCount?: number;
};

export type Organization = {
  slug: string;
  name: string;
  type: string;
  status: string;
  strength: "Strong" | "Warm";
  description: string;
  roster: { slug: string; name: string; title: string; snippet: string; strength: "Strong" | "Warm" }[];
  sharedTimeline: { date: string; title: string; withNames: string }[];
};

export type ReconnectSuggestion = {
  slug: string;
  name: string;
  title: string;
  quietFor: string;
  reason: string;
  source: string;
};

export type OrgCatchUp = {
  slug: string;
  name: string;
  type: string;
  quietFor: string;
  reason: string;
  source: string;
};

export type DossierEvent = {
  slug: string;
  title: string;
  date: string;
  location?: string;
};

export type ActivityItem = {
  date: string;
  title: string;
  context: string;
  body: string;
  source: string;
};

export const people: Record<string, Person> = {
  "jane-smith": {
    slug: "jane-smith",
    name: "Jane Smith",
    title: "Chief Product Officer, Acme",
    org: "Acme",
    strength: "Strong · 7 interactions",
    narrative:
      "You worked together at Meta from 2018–2021, where she led Search Ads and you partnered closely on growth. You reconnected in 2024 through Products That Count, and have stayed close since — dinners in Seattle, a shared summit keynote, and a steady thread of introductions in both directions.",
    linkedOrgs: [
      { name: "Acme", role: "Employer · current" },
      { name: "Meta", role: "Employer · 2018–2021" },
      { name: "Products That Count", role: "Community · member since 2024" },
    ],
    timeline: [
      {
        title: "Dinner, Seattle",
        date: "May 14, 2026",
        body: "Discussed her transition into the CPO role and Acme's new platform strategy — a long, unhurried dinner.",
        source: "via Calendar, May 2026",
        tier: 1,
      },
      {
        title: "Keynote, Products That Count Summit",
        date: "Feb 3, 2026",
        body: "She opened the summit; caught up backstage afterward about Acme's roadmap.",
        source: "via Granola, Feb 2026",
        tier: 1,
      },
      {
        title: "Coffee, Acme HQ",
        date: "Nov 12, 2025",
        body: "First conversation since Meta — she'd just joined Acme as CPO and wanted an outside read on the product org.",
        source: "via Calendar, Nov 2025",
        tier: 1,
      },
      {
        title: "Email thread — panel speaker exchange",
        date: "Sep 2025",
        source: "via Gmail, Sep 2025",
        tier: 2,
      },
    ],
    lowSignalCount: 12,
  },
  "marcus-webb": {
    slug: "marcus-webb",
    name: "Marcus Webb",
    title: "Head of Product, Lattice",
    org: "Lattice",
    strength: "Warm · 3 interactions",
    narrative:
      "You met through Products That Count and co-keynoted the 2026 summit together. Easy rapport, but the relationship hasn't had much room to deepen outside of community events yet.",
    linkedOrgs: [
      { name: "Lattice", role: "Employer · current" },
      { name: "Products That Count", role: "Community · member since 2023" },
    ],
    timeline: [
      {
        title: "Summit keynote, San Francisco",
        date: "Feb 3, 2026",
        body: "Co-keynoted the Products That Count Summit — split the talk on platform strategy.",
        source: "via Granola, Feb 2026",
        tier: 1,
      },
      {
        title: "Email thread — summit prep",
        date: "Jan 2026",
        source: "via Gmail, Jan 2026",
        tier: 2,
      },
    ],
  },
  "priya-raman": {
    slug: "priya-raman",
    name: "Priya Raman",
    title: "VP Product, HubSpot",
    org: "HubSpot",
    strength: "Warm · 4 interactions",
    narrative:
      "Met at a Products That Count quarterly dinner in 2023 and stayed in touch since. She introduced you to two people at Acme last year — one of the more generous connectors in your network.",
    linkedOrgs: [
      { name: "HubSpot", role: "Employer · current" },
      { name: "Products That Count", role: "Community · member since 2022" },
    ],
    timeline: [
      {
        title: "Quarterly dinner, New York",
        date: "Oct 2025",
        body: "Products That Count dinner — she introduced you to two people building at Acme.",
        source: "via Calendar, Oct 2025",
        tier: 1,
      },
      {
        title: "Intro email — Acme connections",
        date: "Nov 2025",
        source: "via Gmail, Nov 2025",
        tier: 2,
      },
    ],
  },
  "devon-cole": {
    slug: "devon-cole",
    name: "Devon Cole",
    title: "Founder, Women in Product",
    org: "Women in Product",
    strength: "Warm · 2 interactions",
    narrative:
      "A crossover member of Products That Count — met through a shared panel in 2025. Your only in-person meeting was coffee just before her book launched.",
    linkedOrgs: [
      { name: "Women in Product", role: "Founder · current" },
      { name: "Products That Count", role: "Community · crossover member" },
    ],
    timeline: [
      {
        title: "Coffee, before book launch",
        date: "Jul 2025",
        body: "First time meeting in person — caught up right before her book launched.",
        source: "via Calendar, Jul 2025",
        tier: 1,
      },
      {
        title: "Shared panel — Products That Count",
        date: "Jun 2025",
        source: "via Granola, Jun 2025",
        tier: 2,
      },
    ],
  },
  "sarah-lin": {
    slug: "sarah-lin",
    name: "Sarah Lin",
    title: "Director of Product, Meta",
    org: "Meta",
    strength: "Warm · 2 interactions",
    narrative:
      "A former Meta colleague. You shared a stage on a leadership panel this spring and talked about a follow-up conversation on her hiring plan that hasn't happened yet.",
    linkedOrgs: [{ name: "Meta", role: "Employer · current" }],
    timeline: [
      {
        title: "Panel, \"Product Leadership in Downturns\"",
        date: "Apr 30, 2026",
        body: "Shared the stage in San Francisco — talked afterward about a follow-up on her hiring plan.",
        source: "via Granola, Apr 2026",
        tier: 1,
      },
    ],
  },
};

export const organizations: Record<string, Organization> = {
  "products-that-count": {
    slug: "products-that-count",
    name: "Products That Count",
    type: "Community · product leadership peer group",
    status: "Active · 14 interactions",
    strength: "Strong",
    description:
      "A peer community for senior product leaders — monthly dinners, an annual summit, and a private Slack. You've been a member since 2022, and it's become the place you reconnect with people from earlier chapters.",
    roster: [
      {
        slug: "jane-smith",
        name: "Jane Smith",
        title: "CPO, Acme",
        snippet: "Reconnected here in 2024 — now your strongest relationship in this group.",
        strength: "Strong",
      },
      {
        slug: "marcus-webb",
        name: "Marcus Webb",
        title: "Head of Product, Lattice",
        snippet: "Co-keynoted the 2026 summit together.",
        strength: "Warm",
      },
      {
        slug: "priya-raman",
        name: "Priya Raman",
        title: "VP Product, HubSpot",
        snippet: "Met at a quarterly dinner in 2023, stayed in touch since.",
        strength: "Warm",
      },
      {
        slug: "devon-cole",
        name: "Devon Cole",
        title: "Founder, Women in Product",
        snippet: "Crossover member — met through a shared panel in 2025.",
        strength: "Warm",
      },
    ],
    sharedTimeline: [
      { date: "Feb 3, 2026", title: "Summit keynote, San Francisco", withNames: "Jane Smith and Marcus Webb" },
      { date: "Oct 2025", title: "Quarterly dinner, New York", withNames: "Priya Raman" },
      { date: "Jun 2025", title: "Slack thread on pricing strategy", withNames: "Devon Cole" },
    ],
  },
  "product-faculty": {
    slug: "product-faculty",
    name: "Product Faculty",
    type: "Community · executive mentorship",
    status: "Active · 31 interactions",
    strength: "Strong",
    description:
      "Executive mentor for the product leadership cohort since 2023 — grading, office hours, and periodic 1:1 coaching with rising PM leaders.",
    roster: [
      {
        slug: "marcus-webb",
        name: "Marcus Webb",
        title: "Head of Product, Lattice",
        snippet: "Cohort mentee turned regular coffee catch-up.",
        strength: "Warm",
      },
    ],
    sharedTimeline: [{ date: "Jan 2026", title: "Coffee catch-up, Seattle", withNames: "Marcus Webb" }],
  },
  "product-school": {
    slug: "product-school",
    name: "Product School",
    type: "Community · training & certification",
    status: "Active · 22 interactions",
    strength: "Warm",
    description: "Guest instructor, product leadership track, since 2021 — cohort talks a few times a year plus ad hoc mentoring.",
    roster: [
      {
        slug: "priya-raman",
        name: "Priya Raman",
        title: "VP Product, HubSpot",
        snippet: "Met at a Product School cohort dinner, stayed in touch since.",
        strength: "Warm",
      },
    ],
    sharedTimeline: [{ date: "Oct 2025", title: "Quarterly dinner, New York", withNames: "Priya Raman" }],
  },
  "women-in-product": {
    slug: "women-in-product",
    name: "Women in Product",
    type: "Community · founder network",
    status: "Active · 9 interactions",
    strength: "Warm",
    description: "Speaker and occasional mentor since 2023 — Devon Cole's community for women building and leading product.",
    roster: [
      {
        slug: "devon-cole",
        name: "Devon Cole",
        title: "Founder, Women in Product",
        snippet: "Founder — your closest tie in this group.",
        strength: "Strong",
      },
    ],
    sharedTimeline: [{ date: "Jun 2025", title: "Slack thread on pricing strategy", withNames: "Devon Cole" }],
  },
  reforge: {
    slug: "reforge",
    name: "Reforge",
    type: "Community · cohort-based courses",
    status: "Active · 5 interactions",
    strength: "Warm",
    description: "Cohort alum, product strategy track, 2021 — occasional alumni panels and growth-loops discussions.",
    roster: [
      {
        slug: "jane-smith",
        name: "Jane Smith",
        title: "CPO, Acme",
        snippet: "Fellow alum from the same cohort.",
        strength: "Warm",
      },
      {
        slug: "marcus-webb",
        name: "Marcus Webb",
        title: "Head of Product, Lattice",
        snippet: "Sat on the growth loops panel together.",
        strength: "Warm",
      },
      {
        slug: "sarah-lin",
        name: "Sarah Lin",
        title: "Director of Product, Meta",
        snippet: "Fellow alum from the same cohort.",
        strength: "Warm",
      },
    ],
    sharedTimeline: [
      { date: "Nov 2024", title: "Panel, growth loops cohort", withNames: "Jane Smith, Marcus Webb, and Sarah Lin" },
    ],
  },
  "mind-the-product": {
    slug: "mind-the-product",
    name: "Mind the Product",
    type: "Community · global PM meetup network",
    status: "Active · 18 interactions",
    strength: "Strong",
    description:
      "Recurring speaker at regional meetups since 2020 — the San Francisco chapter especially, same circuit as the Products That Count summit crowd.",
    roster: [
      {
        slug: "jane-smith",
        name: "Jane Smith",
        title: "CPO, Acme",
        snippet: "Also crossed paths here — shared the summit stage.",
        strength: "Strong",
      },
    ],
    sharedTimeline: [{ date: "Feb 3, 2026", title: "Summit keynote, San Francisco", withNames: "Jane Smith" }],
  },
};

export const orgCatchUps: OrgCatchUp[] = [
  {
    slug: "product-school",
    name: "Product School",
    type: "Community",
    quietFor: "7 months quiet",
    reason: "Your last dinner was in New York — the cohort's grown since then, worth seeing who's new.",
    source: "via Calendar, Oct 2025",
  },
  {
    slug: "reforge",
    name: "Reforge",
    type: "Community",
    quietFor: "10 months quiet",
    reason: "Nothing since the growth loops cohort panel — a new cohort just kicked off.",
    source: "via Calendar, Nov 2024",
  },
  {
    slug: "women-in-product",
    name: "Women in Product",
    type: "Community",
    quietFor: "9 months quiet",
    reason: "Devon mentioned a mentor session coming up — good moment to re-engage.",
    source: "via Slack, Jun 2025",
  },
];

export const reconnectSuggestions: ReconnectSuggestion[] = [
  {
    slug: "marcus-webb",
    name: "Marcus Webb",
    title: "Head of Product, Lattice",
    quietFor: "8 months quiet",
    reason:
      "You both keynoted the Products That Count Summit in February — a natural thread to pick back up.",
    source: "via Granola, Feb 2026 · via Calendar, Feb 2026",
  },
  {
    slug: "priya-raman",
    name: "Priya Raman",
    title: "VP Product, HubSpot",
    quietFor: "6 months quiet",
    reason: "She introduced you to two people at Acme last year — worth closing the loop and telling her how it went.",
    source: "via Gmail, Nov 2025",
  },
  {
    slug: "devon-cole",
    name: "Devon Cole",
    title: "Founder, Women in Product",
    quietFor: "10 months quiet",
    reason: "Your last coffee was right before her book launched — good moment to ask how it went.",
    source: "via Calendar, Jul 2025",
  },
  {
    slug: "sarah-lin",
    name: "Sarah Lin",
    title: "Director of Product, Meta",
    quietFor: "5 months quiet",
    reason: "You talked about a follow-up conversation on hiring after the leadership panel you did together.",
    source: "via Granola, Apr 2026",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    date: "May 14",
    title: "Dinner with Jane Smith",
    context: "Acme, Seattle",
    body: "Talked through her move into the CPO seat and Acme's new platform bet.",
    source: "via Calendar, May 2026",
  },
  {
    date: "Apr 30",
    title: "Panel with Sarah Lin",
    context: '"Product Leadership in Downturns," San Francisco',
    body: "Shared the stage — talked afterward about a follow-up on her hiring plan.",
    source: "via Granola, Apr 2026",
  },
  {
    date: "Apr 22",
    title: "Coffee with Devon Cole",
    context: "Women in Product",
    body: "Caught up before her book launch — first time meeting in person.",
    source: "via Gmail, Apr 2026",
  },
  {
    date: "Apr 2",
    title: "Introduced Priya Raman",
    context: "to a former teammate at HubSpot",
    body: "Double intro email — following up next week to see if it landed.",
    source: "via Gmail, Apr 2026",
  },
];

// Networking events — the equivalent of calendar entries you'd color-code
// to mark as networking, rather than 1:1 interactions already tied to a
// specific person's timeline.
export const events: DossierEvent[] = [
  { slug: "evt-1", title: "Products That Count Summit", date: "Feb 3, 2026", location: "San Francisco, CA" },
  { slug: "evt-2", title: "Coffee catch-up with Marcus Webb", date: "Jan 2026", location: "Seattle, WA" },
  { slug: "evt-3", title: "Mind the Product Meetup — SF Chapter", date: "Feb 2026", location: "San Francisco, CA" },
  { slug: "evt-4", title: "Product School Quarterly Dinner", date: "Oct 2025", location: "New York, NY" },
  { slug: "evt-5", title: "LogRocket Product Leader Networking Dinner", date: "Jun 2025", location: "Seattle, WA" },
  { slug: "evt-6", title: "Reforge Growth Loops Cohort Panel", date: "Nov 2024", location: "Virtual" },
  { slug: "evt-7", title: "Women in Product Mentor Session", date: "Jun 2025", location: "Virtual" },
  { slug: "evt-8", title: "Intro call with Sarah Lin", date: "Apr 2026", location: "Video call" },
  { slug: "evt-9", title: "Executive Roundtable — Seattle", date: "Mar 2025", location: "Seattle, WA" },
  { slug: "evt-10", title: "ADPList Mentorship Session", date: "Feb 2025", location: "Video call" },
];
