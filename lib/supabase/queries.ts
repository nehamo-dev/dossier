import { supabaseReal } from "./real";

export type RealPerson = {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  title: string | null;
};

export type RealOrganization = {
  id: string;
  name: string;
  type: string;
  domain: string | null;
  website: string | null;
  description: string | null;
};

export type RealInteraction = {
  id: string;
  person_id: string;
  organization_id: string | null;
  interaction_type: string | null;
  date: string;
  title: string | null;
  description: string | null;
  meaningfulness_tier: number | null;
  source_id: string | null;
  location: string | null;
  confidence: string | null;
};

export type RealSource = {
  id: string;
  source_type: string;
  external_id: string | null;
  source_date: string | null;
};

export type RealOrgPersonLink = {
  id: string;
  person_id: string;
  organization_id: string;
  role: string | null;
  link_type: string | null;
  confidence: string | null;
};

export async function getAllPeople(): Promise<RealPerson[]> {
  const { data, error } = await supabaseReal.from("people").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAllOrganizations(): Promise<RealOrganization[]> {
  const { data, error } = await supabaseReal.from("organizations").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAllInteractions(): Promise<RealInteraction[]> {
  const { data, error } = await supabaseReal.from("interactions").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllSources(): Promise<RealSource[]> {
  const { data, error } = await supabaseReal.from("sources").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getAllLinks(): Promise<RealOrgPersonLink[]> {
  const { data, error } = await supabaseReal.from("org_person_links").select("*");
  if (error) throw error;
  return data ?? [];
}

export function monthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function shortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function sourceLabel(source: RealSource | undefined): string | null {
  if (!source) return null;
  const kind =
    source.source_type === "gmail"
      ? "Gmail"
      : source.source_type === "calendar"
        ? "Calendar"
        : source.source_type === "granola"
          ? "Granola"
          : source.source_type;
  return source.source_date ? `via ${kind}, ${monthYear(source.source_date)}` : `via ${kind}`;
}

export function daysSince(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function quietForLabel(days: number): string {
  if (days < 60) return `${Math.round(days / 7)} weeks quiet`;
  return `${Math.round(days / 30)} months quiet`;
}
