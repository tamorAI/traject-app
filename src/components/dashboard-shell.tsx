"use client";

import { SidebarInset, SidebarProvider } from "@tamor/ui/components/sidebar";
import { AppSidebar } from "./app-sidebar";

export function DashboardShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
