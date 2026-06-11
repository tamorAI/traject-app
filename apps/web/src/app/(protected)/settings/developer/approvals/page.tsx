"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SettingsPageHeader } from "@/components/settings-page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tamor/ui/components/card";
import { Badge } from "@tamor/ui/components/badge";
import { Button } from "@tamor/ui/components/button";
import { Clock3, CheckCircle2, XCircle } from "lucide-react";

const springConfig = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springConfig, stiffness: 300, damping: 26 },
  },
};

type ApprovalRequest = {
  id: string;
  requestedAction: string;
  status: string;
  context: Record<string, unknown> | null;
  createdAt: string;
  expiresAt: string;
};

export default function ApprovalsSettingsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [operatorToken, setOperatorToken] = useState("");

  useEffect(() => {
    fetch("/api/approvals?status=PENDING")
      .then((r) => r.json())
      .then(setApprovals)
      .catch(() => {});
  }, []);

  const resolve = async (id: string, verdict: "approve" | "deny") => {
    try {
      const res = await fetch(`/api/approvals/${id}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${operatorToken}`,
        },
        body: JSON.stringify({ verdict }),
      });
      if (res.ok) {
        setApprovals((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to resolve");
      }
    } catch {
      alert("Failed to resolve approval");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SettingsPageHeader />

      <motion.div variants={cardReveal}>
        <Card className="card-gradient-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-muted-foreground">
                <Clock3 size={12} />
              </span>
              Approvals Inbox
            </CardTitle>
            <CardDescription>
              Pending human-in-the-loop approval requests from agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Operator Token
              </label>
              <input
                type="password"
                placeholder="tr_op_..."
                value={operatorToken}
                onChange={(e) => setOperatorToken(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              {approvals.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ...springConfig }}
                  className="rounded-lg border border-border/50 p-3 transition-colors hover:border-border/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="text-sm font-medium">{a.requestedAction}</div>
                      {a.context && (
                        <pre className="text-[10px] text-muted-foreground/60 font-mono whitespace-pre-wrap line-clamp-2">
                          {JSON.stringify(a.context, null, 1)}
                        </pre>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
                        <span>Created {new Date(a.createdAt).toLocaleString()}</span>
                        <span>·</span>
                        <span>Expires {new Date(a.expiresAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {a.status}
                    </Badge>
                  </div>
                  {a.status === "PENDING" && operatorToken && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 text-xs"
                        onClick={() => resolve(a.id, "approve")}
                      >
                        <CheckCircle2 size={12} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs text-red-500 hover:text-red-600"
                        onClick={() => resolve(a.id, "deny")}
                      >
                        <XCircle size={12} className="mr-1" />
                        Deny
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
              {approvals.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CheckCircle2 size={32} className="text-muted-foreground/20" />
                  <span className="text-sm text-muted-foreground/50">
                    No pending approvals
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
