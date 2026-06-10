import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard-shell";

const API_URL = process.env.API_URL ?? "http://localhost:8001";

async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: { cookie: cookieStore.toString() },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/login");
  }

  const name = user.name ?? "";

  return (
    <DashboardShell
      user={{
        name: name || "User",
        email: user.email ?? "",
        avatar: (user.image as string) || "/avatar-01.png",
      }}
    >
      {children}
    </DashboardShell>
  );
}
