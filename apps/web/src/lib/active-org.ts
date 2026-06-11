"use client";

import type { Organization } from "@/hooks/use-organizations";

const STORAGE_KEY = "trajeckt:activeOrg";

export function getStoredOrg(): Pick<Organization, "id" | "name" | "slug" | "role"> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredOrg(org: Pick<Organization, "id" | "name" | "slug" | "role">) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(org));
  } catch {}
}

export function clearStoredOrg() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
