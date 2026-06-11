"use client";

import { useSession } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Spinner } from "@tamor/ui/components/spinner";
import { getStoredOrg } from "@/lib/active-org";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isOnboarding = pathname === "/onboarding";
  const isOrgSelect = pathname === "/org-select";
  const isAuthPage = pathname.startsWith("/auth/");
  const isBarePage = isOnboarding || isOrgSelect || isAuthPage;

  useEffect(() => {
    if (!isLoading && (!data?.user || isError)) {
      router.replace("/auth/login");
    }
  }, [isLoading, data, isError, router]);

  useEffect(() => {
    if (
      !isLoading &&
      data?.user &&
      !data.user.onboardingCompleted &&
      !isOnboarding
    ) {
      router.replace("/onboarding");
    }
  }, [isLoading, data, isOnboarding, router]);

  useEffect(() => {
    if (
      !isLoading &&
      data?.user &&
      data.user.onboardingCompleted &&
      !isBarePage &&
      !getStoredOrg()
    ) {
      router.replace("/org-select");
    }
  }, [isLoading, data, isOnboarding, isOrgSelect, isAuthPage, router, isBarePage]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="w-6 h-6"/>
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  if (isBarePage) {
    return <>{children}</>;
  }

  const user = data.user;

  return (
    <DashboardShell
      user={{
        name: user.name ?? "User",
        email: user.email ?? "",
        avatar: (user.image as string) || "/avatar-01.png",
      }}
    >
      {children}
    </DashboardShell>
  );
}
