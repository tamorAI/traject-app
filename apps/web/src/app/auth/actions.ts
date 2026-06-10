"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:8001";

type ActionResult = {
  error?: Record<string, string[]>;
  success?: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

async function forwardCookies(response: Response) {
  const cookieStore = await cookies();
  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    const [nameValue] = cookie.split(";");
    const eqIdx = nameValue.indexOf("=");
    if (eqIdx === -1) continue;
    const name = nameValue.slice(0, eqIdx);
    const value = nameValue.slice(eqIdx + 1);
    if (name) {
      cookieStore.set(name, value, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
  }
}

async function apiPost(path: string, body: unknown) {
  const cookieStore = await cookies();
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore.toString(),
    },
    body: JSON.stringify(body),
  });
}

export async function login(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const res = await apiPost("/api/auth/sign-in/email", parsed.data);
  const data = await res.json();

  if (!res.ok) {
    return { error: { form: [data?.message ?? data?.error ?? "Invalid credentials"] } };
  }

  await forwardCookies(res);
  revalidatePath("/", "layout");
  redirect("/overview");
}

export async function signup(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const res = await apiPost("/api/auth/sign-up/email", {
    email: parsed.data.email,
    password: parsed.data.password,
    name: parsed.data.name,
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: { form: [data?.message ?? data?.error ?? "Registration failed"] } };
  }

  return { success: "Account created successfully. You can now sign in." };
}

export async function signOut() {
  await apiPost("/api/auth/sign-out", {});
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function forgotPassword(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string | null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: { email: ["Invalid email address"] } };
  }

  const res = await apiPost("/api/auth/request-password-reset", { email });
  const data = await res.json();

  if (!res.ok) {
    return { error: { form: [data?.message ?? data?.error ?? "Failed to send reset email"] } };
  }

  return { success: "Check your email for the reset link." };
}

export async function updatePassword(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const res = await apiPost("/api/auth/reset-password", {
    newPassword: parsed.data.password,
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: { form: [data?.message ?? data?.error ?? "Failed to update password"] } };
  }

  return { success: "Password updated successfully." };
}
