import { createClient } from "@/supabase/server";
import { ProfileSettingsForm } from "@/components/profile-settings-form";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = {
    firstName: (user?.user_metadata?.first_name as string) ?? "",
    lastName: (user?.user_metadata?.last_name as string) ?? "",
    email: user?.email ?? "",
    phone: (user?.user_metadata?.phone as string) ?? "",
    avatarUrl: (user?.user_metadata?.avatar_url as string) ?? null,
  };

  return <ProfileSettingsForm initialData={profile} />;
}
