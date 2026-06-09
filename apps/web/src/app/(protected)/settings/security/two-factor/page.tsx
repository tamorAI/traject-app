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
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Switch } from "@tamor/ui/components/switch";
import { ShieldCheck, Smartphone, AlertCircle } from "lucide-react";

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

export default function TwoFactorSettingsPage() {
  const [enabled, setEnabled] = useState(false);

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
                <ShieldCheck size={12} />
              </span>
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ShieldCheck size={15} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Enable 2FA</span>
                  <p className="text-xs text-muted-foreground/70">
                    Secure your account with a second authentication factor
                  </p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={springConfig}
                className="space-y-4"
              >
                <div className="h-px bg-border/40" />
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>
                    Use an authenticator app like Google Authenticator or Authy
                    to scan the QR code.
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-muted">
                    <Smartphone size={36} className="text-muted-foreground/40" />
                  </div>
                  <span className="text-xs text-muted-foreground/50">
                    QR code placeholder
                  </span>
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter verification code"
                    className="flex-1"
                  />
                  <Button variant="outline">Verify</Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
