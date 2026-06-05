"use client";

import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Search,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import { motion } from "motion/react";

const pillars = [
  {
    id: "observe",
    icon: Activity,
    title: "Observe",
    summary:
      "See how agents actually work, not how they were intended to work.",
    points: [
      "Execution timelines",
      "Decision paths",
      "Tool usage",
      "Resource access",
      "Failure points",
    ],
  },
  {
    id: "govern",
    icon: Shield,
    title: "Govern",
    summary: "Set boundaries before execution and enforce policy in real time.",
    points: [
      "Approved actions",
      "Resource controls",
      "Operational scope",
      "Human approvals",
      "Escalation paths",
    ],
  },
  {
    id: "investigate",
    icon: Search,
    title: "Investigate",
    summary: "Replay incidents, trace provenance, and understand what changed.",
    points: [
      "Session replay",
      "Incident analysis",
      "Provenance tracking",
      "Failure diagnostics",
      "Root-cause analysis",
    ],
  },
  {
    id: "improve",
    icon: Sparkles,
    title: "Improve",
    summary:
      "Turn trajectories into operating intelligence and benchmarkable data.",
    points: [
      "Success patterns",
      "Failure patterns",
      "Agent benchmarks",
      "Operational metrics",
      "Optimization insights",
    ],
  },
];

function PillarCard({
  pillar,
  className,
}: {
  pillar: (typeof pillars)[number];
  className: string;
}) {
  const Icon = pillar.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden border border-border bg-background p-6 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)] ${className}`}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center border border-border bg-muted/40 text-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div className="border border-border bg-muted/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {pillar.id}
          </div>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] font-heading">
          {pillar.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {pillar.summary}
        </p>

        <div className="mt-5 space-y-2.5">
          {pillar.points.map((point, index) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + index * 0.03, duration: 0.25 }}
              className="flex items-center gap-2.5 border border-border/70 bg-muted/20 px-3 py-2 text-sm text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 bg-foreground/60" />
              {point}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {pillar.id === "observe"
                ? "Visibility"
                : pillar.id === "govern"
                  ? "Controls"
                  : pillar.id === "investigate"
                    ? "Replay"
                    : "Learning"}
            </div>
            <div className="mt-1 text-sm font-medium">
              {pillar.id === "observe"
                ? "Execution state"
                : pillar.id === "govern"
                  ? "Boundary enforcement"
                  : pillar.id === "investigate"
                    ? "Incident forensics"
                    : "Trajectory intelligence"}
            </div>
          </div>
          <span className="inline-flex h-8 w-8 items-center justify-center border border-border bg-background text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturesSection() {
  return (
    <section id="platform" className="relative py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
            >
              <Workflow className="h-3.5 w-3.5" />
              Platform pillars
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.35 }}
              className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
            >
              A control surface for every part of the agent lifecycle
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base"
          >
            Trajeckt does for agent execution what Firecrawl does for live web
            data: reveal the path, shape the guardrails, and surface the
            intelligence hidden in every run.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <PillarCard pillar={pillars[0]} className="lg:col-span-7" />
          <PillarCard pillar={pillars[1]} className="lg:col-span-5" />
          <PillarCard pillar={pillars[2]} className="lg:col-span-5" />
          <PillarCard pillar={pillars[3]} className="lg:col-span-7" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-8 border border-border bg-background p-4 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Why this matters
              </div>
              <div className="mt-1 text-lg font-medium tracking-[-0.02em] font-heading">
                Logs tell you what happened. Trajectories tell you why it
                happened.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="#intelligence" />}
            >
              See trajectory intelligence
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              "Execution timelines",
              "Policy boundaries",
              "Benchmarked outcomes",
            ].map((item) => (
              <div
                key={item}
                className="border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
