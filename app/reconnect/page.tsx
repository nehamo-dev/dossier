"use client";

import RequireAccess from "@/components/RequireAccess";
import ReconnectList from "@/components/ReconnectList";

export default function ReconnectPage() {
  return (
    <RequireAccess>
      <ReconnectList />
    </RequireAccess>
  );
}
