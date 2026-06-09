"use client";

import { motion } from "framer-motion";
import { SettingsPageHeader } from "@/components/settings-page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tamor/ui/components/card";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Badge } from "@tamor/ui/components/badge";
import { Code2, Plus, Copy, Trash2, Key } from "lucide-react";

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

const apiKeys = [
  { id: "1", name: "Production", key: "tr_sk_...a1b2c3", created: "Jan 15, 2026" },
  { id: "2", name: "Staging", key: "tr_sk_...d4e5f6", created: "Mar 2, 2026" },
];

export default function ApiKeysSettingsPage() {
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
                <Key size={12} />
              </span>
              API Keys
            </CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Plus size={14} className="mr-1.5" />
              Generate New Key
            </Button>
            <div className="space-y-2">
              {apiKeys.map((apiKey, i) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ...springConfig }}
                  className="group flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:border-border/80"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Key size={14} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {apiKey.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {apiKey.key}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground/50 block">
                        Created {apiKey.created}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {apiKeys.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Code2 size={32} className="text-muted-foreground/20" />
                <span className="text-sm text-muted-foreground/50">
                  No API keys created yet
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
