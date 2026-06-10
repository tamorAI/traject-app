"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:8001";

type ActionResult = {
  error?: Record<string, string[]>;
  success?: string;
};

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

async function apiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
      ...options.headers,
    },
  });
}

export async function updateProfile(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const res = await apiFetch("/api/auth/update-user", {
    method: "POST",
    body: JSON.stringify({
      name: `${parsed.data.firstName} ${parsed.data.lastName}`,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: { form: [data?.message ?? data?.error ?? "Failed to update profile"] } };
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

  const res = await apiFetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    if (res.status === 401 || res.status === 403) {
      return { error: { currentPassword: ["Current password is incorrect"] } };
    }
    return { error: { form: [data?.message ?? data?.error ?? "Failed to update password"] } };
  }

  return { success: "Password updated successfully" };
}

export async function uploadAvatar(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult & { avatarUrl?: string }> {
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const cookieStore = await cookies();
  const res = await fetch(`${API_URL}/api/auth/update-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ image: dataUrl }),
  });

  if (!res.ok) {
    return { error: { form: ["Failed to upload avatar"] } };
  }

  const data = await res.json();
  revalidatePath("/settings/profile");
  return { success: "Avatar updated", avatarUrl: data?.user?.image ?? dataUrl };
}

export async function removeAvatar(): Promise<ActionResult> {
  const res = await apiFetch("/api/auth/update-user", {
    method: "POST",
    body: JSON.stringify({ image: null }),
  });

  if (!res.ok) {
    return { error: { form: ["Failed to remove avatar"] } };
  }

  revalidatePath("/settings/profile");
  return { success: "Avatar removed" };
}
