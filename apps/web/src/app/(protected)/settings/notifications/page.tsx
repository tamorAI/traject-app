"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SettingsPageHeader } from "@/components/settings-page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tamor/ui/components/card";
import { Switch } from "@tamor/ui/components/switch";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  Megaphone,
} from "lucide-react";

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

const notificationItems = [
  {
    id: "push",
    icon: Bell,
    title: "Push Notifications",
    description: "Receive notifications in your browser",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Notifications",
    description: "Receive notifications via email",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    id: "sms",
    icon: Smartphone,
    title: "SMS Notifications",
    description: "Receive notifications via text message",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    id: "in-app",
    icon: MessageSquare,
    title: "In-App Messages",
    description: "Receive messages within the app",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing Updates",
    description: "Product updates, tips, and community news",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
  {
    id: "digest",
    icon: Calendar,
    title: "Weekly Digest",
    description: "A summary of your weekly activity",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
];

export default function NotificationsSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    push: true,
    email: true,
    sms: false,
    "in-app": true,
    marketing: false,
    digest: true,
  });

  const toggle = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SettingsPageHeader />

      <motion.div variants={cardReveal}>
        <Card className="space-y-4 card-gradient-border">
          <CardHeader className="flex items-center gap-2">
            <div className="p-1 border bg-muted text-muted-foreground">
              <Bell />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you&apos;d like to receive
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {notificationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, ...springConfig }}
                >
                  <div className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/30 -mx-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center bg-muted text-muted-foreground`}
                      >
                        <Icon size={15} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <p className="text-xs text-muted-foreground/70">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabled[item.id]}
                      onCheckedChange={() => toggle(item.id)}
                      className="shrink-0"
                    />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
