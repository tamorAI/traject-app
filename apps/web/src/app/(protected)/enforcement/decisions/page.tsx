"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tamor/ui/components/card";
import { Badge } from "@tamor/ui/components/badge";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Search, ShieldAlert, Filter } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
};

type Decision = {
  id: string;
  toolName: string;
  verdict: string;
  reason: string | null;
  latencyUs: number | null;
  trajectoryRef: string | null;
  createdAt: string;
};

const verdictColors: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
  ALLOW: "secondary",
  BLOCK: "destructive",
  ASK: "outline",
  WARN: "default",
};

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/enforcement/decisions")
      .then((r) => r.json())
      .then(setDecisions)
      .catch(() => {});
  }, []);

  const filtered = decisions.filter((d) =>
    d.toolName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Decisions</h1>
          <p className="text-sm text-muted-foreground">
            Enforcement decisions from running deployments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 w-48 text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={14} className="mr-1.5" />
            Filter
          </Button>
        </div>
      </div>

      <motion.div variants={itemReveal}>
        <Card className="card-gradient-border">
          <CardHeader className="border-b">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-muted-foreground" />
              <CardTitle className="text-sm">Decision Log</CardTitle>
              <CardDescription>{filtered.length} records</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tool</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Verdict</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Reason</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Latency</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-border/30 last:border-b-0 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">{d.toolName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={verdictColors[d.verdict] ?? "outline"}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {d.verdict}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{d.reason ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {d.latencyUs != null ? `${(d.latencyUs / 1000).toFixed(1)}ms` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {d.createdAt ? new Date(d.createdAt).toLocaleString() : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <ShieldAlert size={32} className="text-muted-foreground/20" />
                <span className="text-sm text-muted-foreground/50">No decisions recorded</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
