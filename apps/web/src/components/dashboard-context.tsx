"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export type DashboardUser = {
  name: string;
  email: string;
  avatar: string;
};

const DashboardUserContext = createContext<DashboardUser | null>(null);

export function DashboardProvider({
  user,
  children,
}: {
  user: DashboardUser;
  children: ReactNode;
}) {
  return (
    <DashboardUserContext.Provider value={user}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  return useContext(DashboardUserContext);
}
