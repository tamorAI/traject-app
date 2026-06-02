"use client";

import { SettingsSidebar } from "@/components/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/3 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/2 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/1 blur-[80px]" />
      </div>

      <SettingsSidebar />

      <div className="md:ml-3 flex-1 min-w-0 relative z-0">
        <div className="max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
