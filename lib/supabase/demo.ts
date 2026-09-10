import { createClient } from "@supabase/supabase-js";

// A fully separate project and client instance from lib/supabase/real.ts —
// never share a client, schema, or query path between real and demo data.
// No auth required here; demo access is anonymous by design.
export const supabaseDemo = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_DEMO_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_DEMO_ANON_KEY || "placeholder-anon-key"
);
