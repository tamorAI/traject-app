"use client";

import { RequestDemoProvider } from "@/components/request-demo-modal";

export default function LandingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequestDemoProvider>{children}</RequestDemoProvider>;
}
