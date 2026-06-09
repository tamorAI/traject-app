import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const name = [
    user.user_metadata?.first_name,
    user.user_metadata?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <DashboardShell
      user={{
        name: name || "User",
        email: user.email ?? "",
        avatar: (user.user_metadata?.avatar_url as string) || "/avatar-01.png",
      }}
    >
      {children}
    </DashboardShell>
  );
}
