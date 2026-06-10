"use client";

import { useSession } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Spinner } from "@tamor/ui/components/spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data?.user || isError)) {
      router.replace("/auth/login");
    }
  }, [isLoading, data, isError, router]);

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
