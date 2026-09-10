import { createClient } from "@supabase/supabase-js";

// Placeholder fallback keeps the build from crashing when the env var isn't
// set yet — never switch this to a `!` assertion (see Wanderluster's own
// known-gotcha for the same pattern).
export const supabaseReal = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_REAL_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_REAL_ANON_KEY || "placeholder-anon-key"
);
