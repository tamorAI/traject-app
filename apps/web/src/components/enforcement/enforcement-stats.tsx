"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@tamor/ui/components/card";
import { Activity, Shield, Radio, Clock3 } from "lucide-react";

type Stats = {
  decisionsToday: number;
  blockRate: number;
  onlineDeployments: number;
  pendingApprovals: number;
};

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 26,
  mass: 0.8,
};

const statCards = [
  { label: "Decisions Today", key: "decisionsToday" as const, icon: Activity },
  { label: "Blocked Actions", key: "blockRate" as const, icon: Shield },
  { label: "Online Deployments", key: "onlineDeployments" as const, icon: Radio },
  { label: "Pending Approvals", key: "pendingApprovals" as const, icon: Clock3 },
];

export function EnforcementStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/enforcement/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1 + i * 0.06, ...springConfig }}
          >
            <Card size="sm" className="relative overflow-hidden transition-shadow duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon size={16} className="text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light tracking-tight md:text-[28px]">
                    {stats[card.key]}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
