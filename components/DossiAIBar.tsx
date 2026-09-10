"use client";

export default function DossiAIBar() {
  function handleSubmit(e: React.FormEvent) {
    // DossiAI isn't wired up yet — Phase 0 (real data ingestion) has to land first.
    e.preventDefault();
  }

  return (
    <div className="px-4 sm:px-16 py-3.5 border-b border-rule">
      <form
        onSubmit={handleSubmit}
        className="max-w-[720px] mx-auto flex items-center gap-3 border border-rule rounded-[4px] px-4 py-2.5 focus-within:border-oxblood transition-colors"
      >
        <span className="w-[22px] h-[22px] rounded-full bg-mark-bg flex items-center justify-center shrink-0">
          <span className="font-serif italic font-semibold text-[12px] text-oxblood">D</span>
        </span>
        <input
          type="text"
          placeholder='Ask DossiAI to add, update, or find something — "when did I last speak with Marcus from Products That Count?"'
          className="flex-1 text-[14px] text-ink placeholder:text-muted outline-none bg-transparent"
        />
        <button type="submit" aria-label="Ask DossiAI" className="text-muted hover:text-oxblood shrink-0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  );
}
