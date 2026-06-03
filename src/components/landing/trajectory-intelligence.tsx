"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, animate } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Layers3,
  Workflow,
  Search,
  Gauge,
  FileText,
  Shield,
  ArrowUpRight,
} from "lucide-react";

const trajectoryGraph = [
  { title: "User Request", icon: Workflow },
  { title: "Plan & Decompose", icon: Layers3 },
  { title: "Search", icon: Search },
  { title: "Analyze", icon: Gauge },
  { title: "Validate", icon: Shield },
  { title: "Result", icon: FileText },
];

const metrics = [
  { value: "92%", label: "Success Rate", trend: "up" as const },
  { value: "1.4", label: "Avg Replans", trend: "down" as const },
  { value: "3%", label: "Escalations", trend: "down" as const },
  { value: "127", label: "Violations Blocked", trend: "up" as const },
];

const insights = [
  {
    value: "+18%",
    label: "Success uplift",
    text: "Tasks with verification steps achieve higher completion rates.",
    trend: "up" as const,
  },
  {
    value: "37%",
    label: "Fewer failures",
    text: "Fallback branches reduce downstream failure rates significantly.",
    trend: "up" as const,
  },
  {
    value: "22%",
    label: "Lower completion",
    text: "Trajectories exceeding 12 vertices see reduced success rates.",
    trend: "down" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

function AnimatedMetric({
  value,
  label,
  trend,
}: {
  value: string;
  label: string;
  trend: "up" | "down";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const numValue = parseFloat(value);
  const isPercent = value.endsWith("%");
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, numValue, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v * 10) / 10),
    });
    return controls.stop;
  }, [isInView, numValue]);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      whileHover={{ y: -1, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border/50 bg-card p-4 transition-shadow duration-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {trend === "up" ? (
          <motion.span
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingUp className="h-3 w-3 text-success" />
          </motion.span>
        ) : (
          <TrendingDown className="h-3 w-3 text-info" />
        )}
        {label}
      </div>
      <div className="mt-2 text-2xl font-light tracking-tight tabular-nums">
        {isInView ? (
          <motion.span
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {Number.isInteger(displayValue)
              ? Math.round(displayValue)
              : displayValue.toFixed(1)}
            {isPercent ? "%" : ""}
          </motion.span>
        ) : (
          <span>0</span>
        )}
      </div>
    </motion.div>
  );
}

export default function TrajectoryIntelligence() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="intelligence" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground"
          >
            Trajectory Intelligence
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Learn how your agents think
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="mt-4 text-muted-foreground"
          >
            Trajeckt analyzes execution trajectories to uncover recurring
            failure modes, inefficient workflows, and successful planning
            strategies.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Trajectory graph</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real execution path visualization
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Declared
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Observed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {trajectoryGraph.map((step, index) => {
                  const Icon = step.icon;
                  const isDeviated = index === 2;
                  const isHovered = hoveredStep === index;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      onMouseEnter={() => setHoveredStep(index)}
                      onMouseLeave={() => setHoveredStep(null)}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 cursor-default transition-opacity duration-300"
                    >
                      <motion.div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                          isDeviated
                            ? "border-warning/30 bg-warning/10 text-warning"
                            : "border-border/50 bg-muted text-muted-foreground"
                        }`}
                        animate={{
                          scale: isHovered ? 1.1 : 1,
                          boxShadow: isHovered
                            ? "0 4px 12px hsl(var(--foreground) / 0.08)"
                            : "0 0px 0px hsl(var(--foreground) / 0)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isHovered ? "text-foreground" : ""
                            }`}
                          >
                            {step.title}
                          </span>
                          {isDeviated && (
                            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] text-warning">
                              Recovery
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted mt-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: isDeviated ? "75%" : "100%",
                            }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.1 + 0.3,
                              duration: 0.6,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDeviated
                                ? "bg-warning/50"
                                : "bg-success/50"
                            } ${isHovered ? "opacity-80" : ""}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <motion.span
                          className="tabular-nums"
                          animate={{ color: isHovered ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                        >
                          {index + 1}
                        </motion.span>
                        {index < trajectoryGraph.length - 1 && (
                          <motion.div
                            animate={{
                              x: isHovered ? 2 : 0,
                              opacity: isHovered ? 0.8 : 0.4,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowUpRight className="h-3 w-3 rotate-45 text-muted-foreground/40" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Declared
                  </div>
                  <div className="mt-1 text-lg font-light tabular-nums">
                    9 vertices
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Observed
                  </div>
                  <div className="mt-1 text-lg font-light tabular-nums">
                    11 vertices
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Deviation
                  </div>
                  <div className="mt-1 text-lg font-light text-warning tabular-nums">
                    +2 recovery
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <AnimatedMetric
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  trend={metric.trend}
                />
              ))}
            </div>

            <motion.div
              variants={itemVariants}
              className="rounded-xl border border-border/50 bg-card p-4"
            >
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Most common failure
              </h4>
              <div className="mt-3 space-y-1.5">
                {["Search → Extract → Timeout → Retry → Success"].map(
                  (path) => (
                    <div
                      key={path}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground"
                    >
                      <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {path}
                      </motion.span>
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            {insights.map((insight) => (
              <motion.div
                key={insight.label}
                variants={itemVariants}
                whileHover={{
                  y: -2,
                  borderColor: "hsl(var(--border))",
                  transition: { duration: 0.2 },
                }}
                className="rounded-xl border border-border/50 bg-card p-4 transition-shadow duration-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {insight.label}
                  </span>
                  <motion.span
                    className={`text-xs font-medium tabular-nums ${
                      insight.trend === "up"
                        ? "text-success"
                        : "text-warning"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {insight.value}
                  </motion.span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {insight.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
