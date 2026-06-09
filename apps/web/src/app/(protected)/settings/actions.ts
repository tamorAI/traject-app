"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/supabase/server";

type ActionResult = {
  error?: Record<string, string[]>;
  success?: string;
};

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function updateProfile(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["Not authenticated"] } };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      phone: parsed.data.phone ?? null,
    },
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  revalidatePath("/settings/profile");
  return { success: "Profile updated successfully" };
}

export async function updatePassword(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: { form: ["Not authenticated"] } };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });

  if (signInError) {
    return { error: { currentPassword: ["Current password is incorrect"] } };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  return { success: "Password updated successfully" };
}

export async function uploadAvatar(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult & { avatarUrl?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["Not authenticated"] } };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { error: { form: ["No file provided"] } };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: { form: ["File size must be less than 2MB"] } };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: { form: ["File must be PNG, JPG, or WebP"] } };
  }

  const fileExt = file.name.split(".").pop() || "png";
  const filePath = `${user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return { error: { form: [uploadError.message] } };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (updateError) {
    return { error: { form: [updateError.message] } };
  }

  revalidatePath("/settings/profile");
  return { success: "Avatar updated", avatarUrl: publicUrl };
}

export async function removeAvatar(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { form: ["Not authenticated"] } };
  }

  const currentAvatarUrl = user.user_metadata?.avatar_url as string | undefined;
  if (currentAvatarUrl) {
    const urlParts = currentAvatarUrl.split("/avatars/");
    if (urlParts.length > 1) {
      const path = urlParts[1];
      await supabase.storage.from("avatars").remove([path]);
    }
  }

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: null },
  });

  if (error) {
    return { error: { form: [error.message] } };
  }

  revalidatePath("/settings/profile");
  return { success: "Avatar removed" };
}
