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
import { Webhook, Plus, Copy, Trash2, Globe } from "lucide-react";

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

const webhooks = [
  {
    id: "1",
    url: "https://api.example.com/webhooks/traject",
    events: ["task.completed", "task.created"],
    active: true,
  },
  {
    id: "2",
    url: "https://hooks.slack.com/services/xxx",
    events: ["error.occurred"],
    active: true,
  },
];

export default function WebhooksSettingsPage() {
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
                <Webhook size={12} />
              </span>
              Webhooks
            </CardTitle>
            <CardDescription>
              Send real-time events to your own endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="https://example.com/webhook" className="flex-1" />
              <Button>
                <Plus size={14} className="mr-1.5" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {webhooks.map((hook, i) => (
                <motion.div
                  key={hook.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ...springConfig }}
                  className="group flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:border-border/80"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Globe size={14} />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <span className="block truncate text-sm font-mono text-sm">
                        {hook.url}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {hook.events.map((e) => (
                          <span
                            key={e}
                            className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
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
            {webhooks.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Webhook
                  size={32}
                  className="text-muted-foreground/20"
                />
                <span className="text-sm text-muted-foreground/50">
                  No webhooks configured yet
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
