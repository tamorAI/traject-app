"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: "ROLE_OWNER" | "ROLE_ADMIN" | "ROLE_MEMBER" | "ROLE_VIEWER";
}

export const ORGS_KEY = ["organizations"];

export function useOrganizations() {
  return useQuery({
    queryKey: ORGS_KEY,
    queryFn: async ({ signal }) => {
      const data = await api.get<Organization[]>("/api/organizations", {
        signal,
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
