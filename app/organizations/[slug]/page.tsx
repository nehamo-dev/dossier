"use client";

import { useParams } from "next/navigation";
import RequireAccess from "@/components/RequireAccess";
import OrganizationDetail from "@/components/OrganizationDetail";

export default function OrganizationPage() {
  const params = useParams<{ slug: string }>();
  return (
    <RequireAccess>
      <OrganizationDetail slug={params.slug} />
    </RequireAccess>
  );
}
