"use client";

import { SidebarInset, SidebarProvider } from "@tamor/ui/components/sidebar";
import { AppSidebar } from "./app-sidebar";
import { DashboardProvider } from "./dashboard-context";
import type { ReactNode } from "react";

export function DashboardShell({
  user,
  children,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  children: ReactNode;
}) {
  return (
    <DashboardProvider user={user}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar user={user} />

        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  );
}
