"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SettingsPageHeader } from "@/components/settings-page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tamor/ui/components/card";
import { Sun, Moon, Monitor, MoonStar, Palette } from "lucide-react";

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

const themeCards = [
  {
    value: "light" as const,
    label: "Light",
    icon: Sun,
    iconBg: "bg-muted",
    ring: "ring-primary",
    desc: "Clean, bright interface",
  },
  {
    value: "dark" as const,
    label: "Dark",
    icon: Moon,
    iconBg: "bg-muted text-slate-200",
    ring: "ring-primary",
    desc: "Easy on the eyes",
  },
  {
    value: "system" as const,
    label: "System",
    icon: Monitor,
    iconBg: "bg-muted text-muted-foreground",
    ring: "ring-primary",
    desc: "Follows your device",
  },
];

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "system";

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
            <div className="flex rounded-xl bg-muted p-2 border text-muted-foreground">
              <Palette />
            </div>

            <div>
              <CardTitle className="flex items-center gap-2">Theme</CardTitle>
              <CardDescription>
                Choose how Traject looks for you
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeCards.map(
                ({ value, label, icon: Icon, iconBg, ring, desc }) => {
                  const isActive = currentTheme === value;
                  return (
                    <motion.button
                      key={value}
                      onClick={() => setTheme(value)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex flex-col items-center gap-3 border p-4 text-center transition-all duration-300 ${
                        isActive
                          ? `border-primary/30 ${ring} shadow-sm`
                          : "border-border/50 hover:border-border/80"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br opacity-[0.03] dark:opacity-[0.06]`}
                      />
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="theme-glow"
                            className="absolute -inset-[2px] bg-primary/5 blur-md"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                          <motion.div
                            layoutId="theme-ring"
                            className="absolute inset-0 ring-1 ring-primary/20"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        </>
                      )}
                      <div className="relative z-10 flex flex-col items-center gap-2.5">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                            isActive
                              ? `${iconBg} scale-110`
                              : "bg-muted text-muted-foreground group-hover:bg-accent"
                          }`}
                        >
                          <motion.div
                            animate={
                              isActive
                                ? { rotate: [0, -8, 8, 0] }
                                : { rotate: 0 }
                            }
                            transition={{ duration: 0.5, delay: 0.1 }}
                          >
                            <Icon size={19} />
                          </motion.div>
                        </div>
                        <div className="space-y-0.5">
                          <span
                            className={`text-sm font-medium block ${
                              isActive
                                ? "text-foreground"
                                : "text-foreground/70"
                            }`}
                          >
                            {label}
                          </span>
                          <span className="text-[11px] text-muted-foreground/60 block leading-tight">
                            {desc}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                          className="absolute -top-1.5 -right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow-xs"
                        >
                          <motion.svg
                            viewBox="0 0 12 12"
                            className="h-3 w-3 fill-none stroke-current stroke-2"
                          >
                            <motion.polyline
                              points="2 6 5 9 10 3"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            />
                          </motion.svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
