"use client";

import { ProfileSettingsForm } from "@/components/profile-settings-form";
import { useDashboardUser } from "@/components/dashboard-context";

export default function ProfileSettingsPage() {
  const user = useDashboardUser();

  const nameParts = (user?.name ?? "").split(" ");
  const profile = {
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: "",
    avatarUrl: (user?.avatar as string) ?? null,
  };

  return <ProfileSettingsForm initialData={profile} />;
}
