"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Gauge,
  Layers3,
  Search,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Workflow,
} from "lucide-react";
import type React from "react";
import { motion, animate, useInView } from "motion/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@tamor/ui/components/tabs";

const trajectoryGraph = [
  { title: "User request", icon: Workflow, tag: "input" },
  { title: "Plan & decompose", icon: Layers3, tag: "reason" },
  { title: "Search", icon: Search, tag: "tooling" },
  { title: "Analyze", icon: Gauge, tag: "inspect" },
  { title: "Validate", icon: Shield, tag: "policy" },
  { title: "Result", icon: Sparkles, tag: "output" },
];

const metrics = [
  { value: "92%", label: "Success rate", trend: "up" as const },
  { value: "1.4", label: "Avg replans", trend: "down" as const },
  { value: "3%", label: "Escalations", trend: "down" as const },
  { value: "127", label: "Violations blocked", trend: "up" as const },
];

const feedEvents = [
  {
    time: "00:03",
    title: "Request normalized",
    detail: "The agent decomposed the prompt into 6 action vertices.",
    state: "Aligned",
  },
  {
    time: "00:11",
    title: "Search branch expanded",
    detail: "A fallback branch was added when the first API path timed out.",
    state: "Recovered",
  },
  {
    time: "00:18",
    title: "Policy check passed",
    detail: "Approval required for a privileged write operation.",
    state: "Checked",
  },
  {
    time: "00:24",
    title: "Result committed",
    detail: "Observed trajectory matched the intended end state.",
    state: "Complete",
  },
];

const policyRows = [
  ["Tool access", "Restricted", "Search, write, and export"],
  ["Human approval", "Required", "Privileged operations"],
  ["Escalation path", "Routed", "Budget or uncertainty spikes"],
  ["Replay status", "Stored", "Full trajectory retained"],
];

const learningRows = [
  ["Verification steps", "+18%", "Higher completion confidence"],
  ["Fallback branches", "-37%", "Fewer hard failures"],
  ["Long trajectories", "-22%", "Lower finish quality"],
];

const failureRows = [
  { label: "External API timeout", value: "31%" },
  { label: "Missing information", value: "24%" },
  { label: "Budget exceeded", value: "18%" },
  { label: "Tool permission denied", value: "15%" },
];

const nodeCoords = [
  [60, 160],
  [195, 130],
  [330, 170],
  [465, 115],
  [600, 155],
  [740, 120],
];

function TrajectoryFlow() {
  return (
    <div className="border border-border bg-background p-5 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Observed trajectory
          </div>
          <div className="mt-1 text-sm font-medium">Declared plan vs real execution</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="border border-border bg-muted/30 px-3 py-1.5">
            Declared 9 vertices
          </span>
          <span className="border border-border bg-muted/30 px-3 py-1.5">
            Observed 11 vertices
          </span>
        </div>
      </div>

      <div className="mt-5">
        <svg viewBox="0 0 800 240" className="h-[200px] w-full">
          <defs>
            <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <path
            d={[
              `M ${nodeCoords[0][0]} ${nodeCoords[0][1]}`,
              `C ${nodeCoords[0][0] + 50} ${nodeCoords[0][1] - 40}, ${nodeCoords[1][0] - 50} ${nodeCoords[1][1] + 30}, ${nodeCoords[1][0]} ${nodeCoords[1][1]}`,
              `S ${nodeCoords[2][0] - 50} ${nodeCoords[2][1] - 40}, ${nodeCoords[2][0]} ${nodeCoords[2][1]}`,
              `S ${nodeCoords[3][0] - 50} ${nodeCoords[3][1] + 30}, ${nodeCoords[3][0]} ${nodeCoords[3][1]}`,
              `S ${nodeCoords[4][0] - 50} ${nodeCoords[4][1] - 40}, ${nodeCoords[4][0]} ${nodeCoords[4][1]}`,
              `S ${nodeCoords[5][0] - 50} ${nodeCoords[5][1] + 30}, ${nodeCoords[5][0]} ${nodeCoords[5][1]}`,
            ].join(" ")}
            fill="none"
            stroke="url(#flowGrad)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          <path
            d={[
              `M ${nodeCoords[0][0]} ${nodeCoords[0][1]}`,
              `C ${nodeCoords[0][0] + 50} ${nodeCoords[0][1] - 40}, ${nodeCoords[1][0] - 50} ${nodeCoords[1][1] + 30}, ${nodeCoords[1][0]} ${nodeCoords[1][1]}`,
              `S ${nodeCoords[2][0] - 50} ${nodeCoords[2][1] - 40}, ${nodeCoords[2][0]} ${nodeCoords[2][1]}`,
              `S ${nodeCoords[3][0] - 50} ${nodeCoords[3][1] + 30}, ${nodeCoords[3][0]} ${nodeCoords[3][1]}`,
              `S ${nodeCoords[4][0] - 50} ${nodeCoords[4][1] - 40}, ${nodeCoords[4][0]} ${nodeCoords[4][1]}`,
              `S ${nodeCoords[5][0] - 50} ${nodeCoords[5][1] + 30}, ${nodeCoords[5][0]} ${nodeCoords[5][1]}`,
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            className="text-foreground"
          />

          {nodeCoords.map(([cx, cy], index) => (
            <g key={`${cx}-${cy}`}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={index === 0 || index === 5 ? 10 : 8}
                fill="currentColor"
                className="text-foreground"
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r={index === 0 || index === 5 ? 4 : 3}
                fill="var(--color-background)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 + 0.15, duration: 0.3 }}
              />
              <text
                x={cx}
                y={cy + 28}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
              >
                {trajectoryGraph[index].tag}
              </text>
            </g>
          ))}

          {nodeCoords.slice(0, -1).map((_, index) => {
            const midX = (nodeCoords[index][0] + nodeCoords[index + 1][0]) / 2;
            const midY = (nodeCoords[index][1] + nodeCoords[index + 1][1]) / 2 - 8;
            return (
              <motion.text
                key={`arrow-${index}`}
                x={midX}
                y={midY}
                textAnchor="middle"
                className="fill-muted-foreground/40 text-xs"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
              >
                →
              </motion.text>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Declared", value: "9", desc: "intended vertices" },
          { label: "Observed", value: "11", desc: "actual vertices" },
          { label: "Deviation", value: "+2", desc: "recovery steps" },
        ].map((item) => (
          <div key={item.label} className="border border-border bg-muted/20 px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight">{item.value}</span>
              <span className="text-[10px] text-muted-foreground">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  value,
  label,
  trend,
}: {
  value: string;
  label: string;
  trend: "up" | "down";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = Number.parseFloat(value);
  const isPercent = value.endsWith("%");

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, numericValue, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest * 10) / 10),
    });

    return controls.stop;
  }, [isInView, numericValue]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -2 }}
      className="border border-border bg-background p-4 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)]"
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {trend === "up" ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] tabular-nums">
        {isInView ? (
          <>
            {Number.isInteger(displayValue)
              ? Math.round(displayValue)
              : displayValue.toFixed(1)}
            {isPercent ? "%" : ""}
          </>
        ) : (
          "0"
        )}
      </div>
    </motion.div>
  );
}

function Card({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col border border-border bg-background p-4 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)] ${className}`}>
      <div className="border-b border-border pb-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </div>
        <div className="mt-1 text-sm font-medium">{description}</div>
      </div>
      <div className="flex-1 pt-4">{children}</div>
    </div>
  );
}

export default function TrajectoryIntelligence() {
  const [tabValue, setTabValue] = useState("feed");

  return (
    <section id="intelligence" className="relative py-10 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
        >
          Trajectory intelligence
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
        >
          Learn how your agents think
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base"
        >
          Trajeckt turns executions into a structured evidence layer: live feeds,
          policy state, replay history, and the learning signals that shape better runs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-10"
        >
          <TrajectoryFlow />
        </motion.div>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col lg:col-span-7"
          >
            <Card title="Execution feed" description="A live, compact view of what changed during the run." className="flex-1">
              <div className="relative pl-5">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-3">
                  {feedEvents.map((event, index) => (
                    <div key={event.title} className="relative">
                      <div className="absolute -left-[13px] top-2 h-2.5 w-2.5 border border-foreground bg-background" />
                      <div className="grid gap-2 border border-border bg-muted/15 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            <Clock3 className="h-3 w-3" />
                            {event.time}
                          </div>
                        </div>
                        <div className="text-sm leading-6 text-muted-foreground">
                          {event.detail}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {event.state}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            step 0{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-col gap-5 lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <MetricTile
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  trend={metric.trend}
                />
              ))}
            </div>

            <Card title="Failure breakdown" description="Root causes by occurrence frequency." className="flex-1">
              <div className="space-y-2">
                {failureRows.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 border border-border bg-muted/15 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold tracking-tight tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {[
              {
                title: "Trajectory insight",
                body: "Verification steps consistently shorten recovery time.",
              },
              {
                title: "Root cause",
                body: "Missing context is still the largest source of replans.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
                className="border border-border bg-background p-4 shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {item.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-5"
        >
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList variant="underline" className="w-full justify-start gap-2 border-b border-border pb-1">
              <TabsTrigger value="feed" className="rounded-none border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.16em]">
                Runtime
              </TabsTrigger>
              <TabsTrigger value="policy" className="rounded-none border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.16em]">
                Policy
              </TabsTrigger>
              <TabsTrigger value="learning" className="rounded-none border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.16em]">
                Learning
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-5 outline-none">
              <div className="grid gap-5 items-stretch lg:grid-cols-2">
                <Card title="Trajectory canvas" description="A dense visual of the plan, recovery, and output path.">
                  <div className="border border-border bg-muted/15 p-3">
                    <svg viewBox="0 0 800 260" className="h-[200px] w-full">
                      <defs>
                        <linearGradient id="canvasGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
                          <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
                        </linearGradient>
                      </defs>
                      <path
                        d={[
                          "M 20 120",
                          "C 85 80, 120 82, 170 110",
                          "S 265 168, 315 145",
                          "S 405 90, 455 108",
                          "S 545 170, 610 145",
                          "S 705 98, 760 72",
                        ].join(" ")}
                        fill="none"
                        stroke="url(#canvasGrad)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <path
                        d={[
                          "M 20 120",
                          "C 85 80, 120 82, 170 110",
                          "S 265 168, 315 145",
                          "S 405 90, 455 108",
                          "S 545 170, 610 145",
                          "S 705 98, 760 72",
                        ].join(" ")}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.1"
                        strokeWidth="1.5"
                        className="text-foreground"
                      />
                      {[
                        [20, 120],
                        [170, 110],
                        [315, 145],
                        [455, 108],
                        [610, 145],
                        [760, 72],
                      ].map(([cx, cy], index) => (
                        <g key={`${cx}-${cy}`}>
                          <motion.circle
                            cx={cx}
                            cy={cy}
                            r={index === 0 || index === 5 ? 8 : 6}
                            fill="currentColor"
                            className="text-foreground"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          />
                          <text
                            x={cx}
                            y={cy + 24}
                            textAnchor="middle"
                            className="fill-muted-foreground text-[10px] uppercase tracking-[0.2em]"
                            style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
                          >
                            {trajectoryGraph[index].tag}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {["Declared", "Observed", "Recovery"].map((item, index) => (
                      <div key={item} className="border border-border bg-muted/20 px-3 py-3">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {item}
                        </div>
                        <div className="mt-1 text-lg font-semibold tracking-tight">
                          {index === 0 ? "9" : index === 1 ? "11" : "+2"}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Commitment visibility" description="Declared versus observed fidelity across the run.">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Declared", value: "9 vertices" },
                      { label: "Observed", value: "11 vertices" },
                      { label: "Deviation", value: "+2 recovery" },
                    ].map((item) => (
                      <div key={item.label} className="border border-border bg-muted/20 px-4 py-3">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="mt-1 text-lg font-semibold tracking-[-0.03em] tabular-nums">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border border-border bg-muted/15 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Most common failure
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search → Extract → Timeout → Retry → Success
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="policy" className="mt-5 outline-none">
              <div className="grid gap-5 items-stretch lg:grid-cols-2">
                <Card title="Policy state" description="The guardrails that shape what the agent can do.">
                  <div className="grid gap-3">
                    {policyRows.map(([label, value, scope]) => (
                      <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border border-border bg-background px-3 py-3">
                        <div>
                          <div className="text-sm font-medium">{label}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{scope}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Blocked actions" description="A compact audit trail of interventions.">
                  <div className="space-y-3">
                    {[
                      ["Write to production bucket", "Denied", "Human approval missing"],
                      ["Escalate budget by 20%", "Routed", "Needs operator review"],
                      ["Call external sync tool", "Allowed", "Within policy"],
                    ].map(([action, decision, reason]) => (
                      <div key={action} className="grid gap-2 border border-border bg-muted/15 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-medium">{action}</div>
                          <span className="border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {decision}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">{reason}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Working note" description="The strongest signal is still the sequence." className="lg:col-span-2">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex-1 border border-border bg-muted/15 p-4 text-sm leading-7 text-muted-foreground">
                      Raw logs are a cost center. Trajectory intelligence is decision support.
                      That is the product story that closes the gap between visibility and control.
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-3">
                      {failureRows.map((item) => (
                        <div key={item.label} className="border border-border bg-background px-3 py-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {item.label}
                          </div>
                          <div className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="learning" className="mt-5 outline-none">
              <div className="grid gap-5 items-stretch lg:grid-cols-2">
                <Card title="Benchmark view" description="Patterns that move outcomes in the right direction.">
                  <div className="border border-border bg-background">
                    <div className="grid grid-cols-[1.1fr_auto_1.2fr] border-b border-border px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <span>Pattern</span>
                      <span>Effect</span>
                      <span>Evidence</span>
                    </div>
                    {learningRows.map(([pattern, effect, note]) => (
                      <div key={pattern} className="grid grid-cols-[1.1fr_auto_1.2fr] border-b border-border px-3 py-3 last:border-b-0">
                        <span className="text-sm font-medium">{pattern}</span>
                        <span className="text-sm font-semibold tracking-tight">{effect}</span>
                        <span className="text-sm text-muted-foreground">{note}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Signals" description="Operational metrics with no bar-chart treatment.">
                  <div className="grid grid-cols-2 gap-4">
                    {metrics.map((metric) => (
                      <MetricTile
                        key={metric.label}
                        value={metric.value}
                        label={metric.label}
                        trend={metric.trend}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
