"use client";

import { motion } from "motion/react";
import {
  Activity,
  Shield,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import Link from "next/link";

const pillars = [
  {
    id: "observe",
    icon: Activity,
    title: "Observe",
    summary: "See how agents actually work.",
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
    summary: "Set boundaries before execution.",
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
    summary: "Understand what happened.",
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
    summary: "Learn from every trajectory.",
    points: [
      "Success patterns",
      "Failure patterns",
      "Agent benchmarks",
      "Operational metrics",
      "Optimization insights",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
            Four pillars
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Complete agent operations
          </h2>
          <p className="mt-4 text-muted-foreground">
            From observation to improvement — a unified platform for
            understanding and controlling AI agent behavior.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                variants={cardVariants}
                className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pillar.summary}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {pillar.points.map((point, i) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40 transition-all duration-300 group-hover:bg-foreground/60 group-hover:scale-150" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            className="group"
            render={<Link href="/auth/signup" />}
          >
            Explore all features
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
