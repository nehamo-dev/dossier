"use client";

import { useParams } from "next/navigation";
import RequireAccess from "@/components/RequireAccess";
import PersonDetail from "@/components/PersonDetail";

export default function PersonPage() {
  const params = useParams<{ slug: string }>();
  return (
    <RequireAccess>
      <PersonDetail slug={params.slug} />
    </RequireAccess>
  );
}
