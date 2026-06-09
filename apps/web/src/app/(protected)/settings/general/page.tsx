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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@tamor/ui/components/select";
import { Languages, Globe } from "lucide-react";

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

export default function GeneralSettingsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SettingsPageHeader />

      <motion.div variants={cardReveal}>
        <Card className="space-y-5 card-gradient-border">
          <CardHeader className="flex items-center gap-2">
            <div className="rounded-xl bg-muted border p-2 text-muted-foreground">
              <Globe />
            </div>

            <div>
              <CardTitle className="flex items-center gap-2">
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your language and regional preferences
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Languages size={15} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Language</span>
                  <p className="text-xs text-muted-foreground/70">
                    Select your preferred language
                  </p>
                </div>
              </div>
              <div className="w-36">
                <Select defaultValue="en">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Globe size={15} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Timezone</span>
                  <p className="text-xs text-muted-foreground/70">
                    Select your timezone
                  </p>
                </div>
              </div>
              <div className="w-48">
                <Select defaultValue="utc">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (UTC+0)</SelectItem>
                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                    <SelectItem value="pst">PST (UTC-8)</SelectItem>
                    <SelectItem value="cet">CET (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
