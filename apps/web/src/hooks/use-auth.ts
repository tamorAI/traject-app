"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, api, type SessionData, type OnboardingPayload } from "@/lib/api/client";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/cookie";
import { clearStoredOrg } from "@/lib/active-org";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const SESSION_KEY = ["session"];

interface AuthResponse {
  redirect?: boolean;
  token?: string;
  user: SessionData["user"];
}

export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: async ({ signal }) => {
      const data = await apiClient.get<SessionData>("/get-session", { signal });
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiClient.post<AuthResponse>("/sign-in/email", data);
      if (res.token) {
        setSessionCookie(res.token);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      router.push("/org-select");
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const res = await apiClient.post<AuthResponse>("/sign-up/email", data);
      if (res.token) {
        setSessionCookie(res.token);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      router.push("/org-select");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/sign-out");
    },
    onSettled: () => {
      clearSessionCookie();
      clearStoredOrg();
      queryClient.setQueryData(SESSION_KEY, { user: null, session: null });
      queryClient.removeQueries({ queryKey: SESSION_KEY });
      router.push("/auth/login");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      await apiClient.post("/request-password-reset", data);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (data: { newPassword: string; token?: string }) => {
      await apiClient.post("/reset-password", data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await apiClient.post("/change-password", data);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await apiClient.post("/update-user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
    },
  });
}

export function useRefreshSession() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: SESSION_KEY });
  }, [queryClient]);
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: OnboardingPayload) => {
      await api.post("/api/onboarding/complete", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      router.push("/org-select");
    },
  });
}
