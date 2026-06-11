"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tamor/ui/components/card";
import { Badge } from "@tamor/ui/components/badge";
import { Radio, Server } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

type Deployment = {
  id: string;
  name: string;
  version: string | null;
  status: string;
  lastHeartbeatAt: string | null;
  compiledGraphId: string | null;
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ONLINE: "default",
  STALE: "secondary",
  OFFLINE: "destructive",
};

const statusDots: Record<string, string> = {
  ONLINE: "bg-green-500",
  STALE: "bg-amber-500",
  OFFLINE: "bg-red-500",
};

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    fetch("/api/enforcement/deployments")
      .then((r) => r.json())
      .then(setDeployments)
      .catch(() => {});
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Deployments</h1>
        <p className="text-sm text-muted-foreground">
          Running trajectoryd gateway instances
        </p>
      </div>

      <motion.div variants={itemReveal} className="grid gap-3">
        {deployments.map((dep) => (
          <Card key={dep.id} className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Server size={15} />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{dep.name}</CardTitle>
                    {dep.version && (
                      <CardDescription>v{dep.version}</CardDescription>
                    )}
                  </div>
                </div>
                <Badge
                  variant={statusColors[dep.status] ?? "outline"}
                  className="gap-1.5 text-[10px] px-2 py-0.5"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDots[dep.status] ?? ""}`} />
                  {dep.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center gap-4 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Radio size={12} />
                Last heartbeat: {dep.lastHeartbeatAt ? new Date(dep.lastHeartbeatAt).toLocaleString() : "never"}
              </span>
              {dep.compiledGraphId && (
                <span>Graph: {dep.compiledGraphId.slice(0, 8)}...</span>
              )}
            </CardContent>
          </Card>
        ))}
        {deployments.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Server size={32} className="text-muted-foreground/20" />
            <span className="text-sm text-muted-foreground/50">No deployments registered</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
