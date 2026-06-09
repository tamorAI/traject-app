"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import { motion, animate, useInView } from "motion/react";

const trustItems = [
  "Trajectory-based analytics",
  "Human approvals",
  "Incident replay",
  "Policy enforcement",
];

const platformStats = [
  { label: "Active trajectories", value: 48 },
  { label: "Pending approvals", value: 3 },
  { label: "Blocked actions", value: 127 },
  { label: "Incident replays", value: 12 },
];

function AnimatedMetric({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <div ref={ref} className="border border-border bg-background px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] tabular-nums">
        {isInView ? displayValue : 0}
      </div>
    </div>
  );
}

function TrajectoryArc() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="arcGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="40%" stopColor="currentColor" stopOpacity="0.03" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.03" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 0 250 Q 360 100, 720 200 T 1440 150"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M 0 300 Q 360 180, 720 260 T 1440 200"
        fill="none"
        stroke="url(#arcGrad2)"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-[0.020]" viewBox="0 0 100 100">
        <defs>
          <pattern
            id="grid"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 16 0 L 0 0 0 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100"
          height="100"
          fill="url(#grid)"
          className="text-foreground"
        />
      </svg>
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative border border-border bg-background shadow-[0_24px_80px_-60px_hsl(var(--foreground)/0.24)]"
        >
          <GridPattern />

          <div className="relative grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 border border-border bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ready when your agents are
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.05, duration: 0.35 }}
                className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl font-heading"
              >
                Turn every trajectory into operating intelligence.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base"
              >
                Start with a control surface built for agent observability,
                governance, and investigation. Trajeckt makes it easier to see
                what happened, enforce what should happen, and improve what
                happens next.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14, duration: 0.3 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-none text-base"
                  render={<Link href="/auth/signup" />}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start free trial
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none text-base"
                  render={<Link href="/auth/login" />}
                >
                  Sign in
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18, duration: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {trustItems.map((item) => (
                  <span
                    key={item}
                    className="border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="relative border-t lg:border-t-0 lg:border-l border-border">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12, duration: 0.4 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 sm:px-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Platform snapshot
                    </div>
                    <div className="mt-0.5 text-sm font-medium">
                      Real-time cluster status
                    </div>
                  </div>
                  <span className="relative flex items-center gap-2 border border-border bg-background px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping bg-foreground/40 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 bg-foreground" />
                    </span>
                    live
                  </span>
                </div>

                <div className="flex-1 p-6 sm:p-8">
                  <div className="grid gap-4">
                    {platformStats.map((stat) => (
                      <AnimatedMetric
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-6 border border-border bg-muted/15 px-4 py-3"
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/60 animate-pulse" />
                      Deploy ready · 0 incidents · All clear
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                      <span>$</span>
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: "auto" }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.8,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        trajeckt deploy --prod --region us-east-1
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                        className="inline-block h-3.5 w-2 bg-foreground/60"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
