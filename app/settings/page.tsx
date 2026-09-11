"use client";

import RequireAccess from "@/components/RequireAccess";
import ConnectionCard from "@/components/ConnectionCard";

function AboutMe() {
  return (
    <div className="max-w-[720px] mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-oxblood">About Me</h1>
      <p className="text-[15px] text-ink-soft mt-2.5 max-w-[560px]">
        Data sources Dossier can draw from. Everything here is read-only, on your side — nothing is ever written back
        to a connected account.
      </p>

      <div className="mt-11">
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-1">Connect a data source</div>
        <div className="text-[12.5px] text-muted mb-4">
          These have a real API to connect through — one-time OAuth, then read-only access.
        </div>
        <div className="flex flex-col">
          <ConnectionCard name="Gmail" description="Email threads — the primary source for who you talk to and when." />
          <ConnectionCard name="Calendar" description="Meetings and events — especially ones you've color-coded, like your networking events." />
          <ConnectionCard name="Granola" description="Meeting notes and transcripts, for what was actually discussed." />
          <ConnectionCard name="Fellow" description="1:1 and meeting notes, if that's where you keep them instead of Granola." isLast />
        </div>
      </div>

      <div className="mt-11">
        <div className="text-[11px] tracking-[0.08em] uppercase text-muted mb-1">Import manually</div>
        <div className="text-[12.5px] text-muted mb-4">
          No personal-data API exists for either of these — WhatsApp only offers a per-conversation chat export, and
          neither iOS nor Android exposes text messages to a web app. Export from the app yourself, then upload here.
        </div>
        <div className="flex flex-col">
          <ConnectionCard
            name="WhatsApp"
            description="Export a chat (Chat → More → Export Chat) and upload the .txt file here."
            action="upload"
          />
          <ConnectionCard
            name="Text messages"
            description="Export your Messages history from your phone or Mac, then upload it here."
            action="upload"
            isLast
          />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireAccess>
      <AboutMe />
    </RequireAccess>
  );
}
