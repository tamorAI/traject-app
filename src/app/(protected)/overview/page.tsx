"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Layers3,
  MessageSquareWarning,
  Search,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@tamor/ui/components/avatar";
import { Badge } from "@tamor/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tamor/ui/components/card";
import { Separator } from "@tamor/ui/components/separator";
import { Button } from "@tamor/ui/components/button";
import { useDashboardUser } from "@/components/dashboard-context";

type TimeWindow = "24h" | "7d" | "30d";

type Trend = "up" | "down" | "neutral";

type MetricCard = {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  icon: typeof Activity;
};

type TrajectoryRow = {
  name: string;
  id: string;
  agent: string;
  initials: string;
  status: "Running" | "Complete" | "Escalated" | "Awaiting approval";
  duration: string;
};

type IncidentRow = {
  name: string;
  agent: string;
  time: string;
  severity: "critical" | "high" | "medium" | "low";
  detail: string;
};

type AuditRow = {
  time: string;
  message: string;
  tag: "ok" | "warn" | "err";
};

type InsightCard = {
  value: string;
  label: string;
  text: string;
  trend: Trend;
};

type AgentRow = {
  name: string;
  status: "Stable" | "Needs review" | "Learning";
  load: string;
  success: string;
  note: string;
};

const windowOptions: { value: TimeWindow; label: string; hint: string }[] = [
  { value: "24h", label: "24h", hint: "Live ops" },
  { value: "7d", label: "7d", hint: "Trend view" },
  { value: "30d", label: "30d", hint: "Portfolio" },
];

const trajectoryGraph = [
  { title: "User request", note: "Observed intent", icon: Workflow },
  { title: "Plan & Decompose", note: "9 declared vertices", icon: Layers3 },
  { title: "Search", note: "3 sources", icon: Search },
  { title: "Analyze", note: "Signal tracing", icon: Gauge },
  { title: "Validate", note: "Policy + approval", icon: Shield },
  { title: "Report", note: "2 findings, 1 escalation", icon: FileText },
];

const pillarCards = [
  {
    id: "observe",
    title: "Observe",
    summary: "See how agents actually work.",
    points: [
      "Execution timelines",
      "Decision paths",
      "Tool usage",
      "Failure points",
    ],
    icon: Activity,
  },
  {
    id: "govern",
    title: "Govern",
    summary: "Set boundaries before execution.",
    points: [
      "Approved actions",
      "Human approvals",
      "Scope controls",
      "Escalation paths",
    ],
    icon: Shield,
  },
  {
    id: "investigate",
    title: "Investigate",
    summary: "Understand what happened.",
    points: [
      "Session replay",
      "Provenance",
      "Incident analysis",
      "Root causes",
    ],
    icon: MessageSquareWarning,
  },
  {
    id: "improve",
    title: "Improve",
    summary: "Learn from every trajectory.",
    points: [
      "Success patterns",
      "Failure patterns",
      "Benchmarks",
      "Operational metrics",
    ],
    icon: Sparkles,
  },
];

const statusVariant: Record<
  TrajectoryRow["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  Running: "default",
  Complete: "secondary",
  Escalated: "destructive",
  "Awaiting approval": "outline",
};

const severityColor: Record<IncidentRow["severity"], string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-zinc-400 dark:bg-zinc-500",
};

const tagBadge: Record<
  AuditRow["tag"],
  "default" | "secondary" | "destructive"
> = {
  ok: "secondary",
  warn: "default",
  err: "destructive",
};

const dashboardFrames: Record<
  TimeWindow,
  {
    title: string;
    subtitle: string;
    metrics: MetricCard[];
    trajectories: TrajectoryRow[];
    incidents: IncidentRow[];
    auditLog: AuditRow[];
    insights: InsightCard[];
    agents: AgentRow[];
    liveFeed: AuditRow[];
    policySummary: {
      headline: string;
      details: string;
      blocked: string;
      approvals: string;
    };
  }
> = {
  "24h": {
    title: "Last 24 hours",
    subtitle: "Best for live operations and active review.",
    metrics: [
      {
        label: "Active trajectories",
        value: "24",
        change: "+3 since the last hour",
        trend: "up",
        icon: Activity,
      },
      {
        label: "Commitment adherence",
        value: "92%",
        change: "Observed steps stayed close to the declared plan",
        trend: "up",
        icon: Layers3,
      },
      {
        label: "Policy blocks",
        value: "18",
        change: "11 blocked before execution",
        trend: "neutral",
        icon: Shield,
      },
      {
        label: "Human escalations",
        value: "3%",
        change: "Below the internal threshold",
        trend: "down",
        icon: AlertTriangle,
      },
    ],
    trajectories: [
      {
        name: "Market Research",
        id: "TRJ-0041",
        agent: "Research Agent",
        initials: "RA",
        status: "Running",
        duration: "2m 14s",
      },
      {
        name: "Customer Support",
        id: "TRJ-0040",
        agent: "Support Agent",
        initials: "SA",
        status: "Complete",
        duration: "5m 02s",
      },
      {
        name: "Data Analysis",
        id: "TRJ-0039",
        agent: "Analyst Agent",
        initials: "AA",
        status: "Escalated",
        duration: "3m 07s",
      },
      {
        name: "Invoice Processing",
        id: "TRJ-0037",
        agent: "Finance Agent",
        initials: "FA",
        status: "Awaiting approval",
        duration: "6m 41s",
      },
    ],
    incidents: [
      {
        name: "Scope violation",
        agent: "Finance Agent",
        time: "4m ago",
        severity: "high",
        detail: "Request drifted outside the approved invoice window.",
      },
      {
        name: "Budget exceeded",
        agent: "Research Agent",
        time: "12m ago",
        severity: "critical",
        detail: "External calls exceeded the hourly spend guardrail.",
      },
      {
        name: "Human approval required",
        agent: "Analyst Agent",
        time: "18m ago",
        severity: "medium",
        detail: "High-impact report needed a final review.",
      },
    ],
    auditLog: [
      { time: "0:02", message: "External API called", tag: "warn" },
      { time: "0:01", message: "Policy check passed", tag: "ok" },
      { time: "0:01", message: "Human review requested", tag: "warn" },
      { time: "-1m", message: "Budget limit reached", tag: "err" },
      { time: "-2m", message: "Trajectory completed", tag: "ok" },
    ],
    insights: [
      {
        value: "+14%",
        label: "Success uplift",
        text: "Verification steps improved success rate over the last 24 hours.",
        trend: "up",
      },
      {
        value: "1.2x",
        label: "Replan efficiency",
        text: "Average replans per task are down from 1.8 last week.",
        trend: "down",
      },
      {
        value: "68%",
        label: "Failure hotspot",
        text: "Most failures still occur during external API access steps.",
        trend: "neutral",
      },
    ],
    agents: [
      {
        name: "Research Agent",
        status: "Stable",
        load: "71%",
        success: "96%",
        note: "Strong at retrieval-heavy tasks.",
      },
      {
        name: "Finance Agent",
        status: "Needs review",
        load: "54%",
        success: "88%",
        note: "Frequently requests approval on edge cases.",
      },
      {
        name: "Support Agent",
        status: "Learning",
        load: "39%",
        success: "91%",
        note: "Fast at triage, slower at follow-ups.",
      },
    ],
    liveFeed: [
      {
        time: "now",
        message: "Trajectory TRJ-0041 entered validation",
        tag: "ok",
      },
      {
        time: "12s",
        message: "Policy check blocked a scope expansion",
        tag: "warn",
      },
      {
        time: "26s",
        message: "Finance Agent requested human approval",
        tag: "warn",
      },
    ],
    policySummary: {
      headline: "Policy coverage is holding",
      details:
        "Most violations are stopped before execution, and the remaining exceptions are routed to review.",
      blocked: "11 blocked actions",
      approvals: "4 pending approvals",
    },
  },
  "7d": {
    title: "Last 7 days",
    subtitle: "Use this for trend and reliability review.",
    metrics: [
      {
        label: "Active trajectories",
        value: "183",
        change: "+18 since last week",
        trend: "up",
        icon: Activity,
      },
      {
        label: "Commitment adherence",
        value: "95%",
        change: "Declared plan and observed path stayed aligned",
        trend: "up",
        icon: Layers3,
      },
      {
        label: "Policy blocks",
        value: "64",
        change: "43 prevented before execution",
        trend: "neutral",
        icon: Shield,
      },
      {
        label: "Human escalations",
        value: "2.1%",
        change: "Trending below the target band",
        trend: "down",
        icon: AlertTriangle,
      },
    ],
    trajectories: [
      {
        name: "Lead Qualification",
        id: "TRJ-0057",
        agent: "Sales Agent",
        initials: "SA",
        status: "Running",
        duration: "3m 42s",
      },
      {
        name: "Document Review",
        id: "TRJ-0056",
        agent: "Legal Agent",
        initials: "LA",
        status: "Complete",
        duration: "8m 10s",
      },
      {
        name: "Churn Analysis",
        id: "TRJ-0055",
        agent: "Growth Agent",
        initials: "GA",
        status: "Escalated",
        duration: "4m 01s",
      },
      {
        name: "Revenue Sync",
        id: "TRJ-0054",
        agent: "Finance Agent",
        initials: "FA",
        status: "Awaiting approval",
        duration: "6m 23s",
      },
    ],
    incidents: [
      {
        name: "Tool permission denied",
        agent: "Legal Agent",
        time: "2h ago",
        severity: "medium",
        detail: "The requested connector was outside the allowed list.",
      },
      {
        name: "Budget threshold hit",
        agent: "Growth Agent",
        time: "6h ago",
        severity: "high",
        detail: "Search loops pushed the task over the cost guardrail.",
      },
    ],
    auditLog: [
      { time: "-12m", message: "Human approval granted", tag: "ok" },
      { time: "-26m", message: "Policy rule matched", tag: "warn" },
      { time: "-48m", message: "Task finished without replans", tag: "ok" },
      { time: "-1h", message: "Retrieval fallback engaged", tag: "warn" },
      { time: "-2h", message: "New trajectory started", tag: "ok" },
    ],
    insights: [
      {
        value: "14%",
        label: "Verification lift",
        text: "Tasks with explicit validation kept the strongest completion rate.",
        trend: "up",
      },
      {
        value: "37%",
        label: "Fallback impact",
        text: "Fallback branches continue to reduce downstream failure rates.",
        trend: "down",
      },
      {
        value: "12",
        label: "High-risk tasks",
        text: "Twelve trajectories crossed the review threshold this week.",
        trend: "neutral",
      },
    ],
    agents: [
      {
        name: "Sales Agent",
        status: "Stable",
        load: "63%",
        success: "94%",
        note: "Consistent on qualification workflows.",
      },
      {
        name: "Legal Agent",
        status: "Needs review",
        load: "47%",
        success: "87%",
        note: "Needs clearer connector boundaries.",
      },
      {
        name: "Growth Agent",
        status: "Learning",
        load: "52%",
        success: "90%",
        note: "Benefits from stronger fallback instructions.",
      },
    ],
    liveFeed: [
      { time: "now", message: "Weekly benchmark refresh started", tag: "ok" },
      {
        time: "18s",
        message: "A fallback branch trimmed a failure path",
        tag: "ok",
      },
      { time: "43s", message: "Legal Agent requested approval", tag: "warn" },
    ],
    policySummary: {
      headline: "Governance remained tight",
      details:
        "Policy matches prevented a large share of risky actions before they reached tools.",
      blocked: "43 blocked actions",
      approvals: "8 open approvals",
    },
  },
  "30d": {
    title: "Last 30 days",
    subtitle: "Use this for performance and planning review.",
    metrics: [
      {
        label: "Active trajectories",
        value: "732",
        change: "+61 compared with the prior month",
        trend: "up",
        icon: Activity,
      },
      {
        label: "Commitment adherence",
        value: "96%",
        change: "The plan graph stayed highly predictable",
        trend: "up",
        icon: Layers3,
      },
      {
        label: "Policy blocks",
        value: "221",
        change: "174 prevented before tool execution",
        trend: "neutral",
        icon: Shield,
      },
      {
        label: "Human escalations",
        value: "1.4%",
        change: "Down month over month",
        trend: "down",
        icon: AlertTriangle,
      },
    ],
    trajectories: [
      {
        name: "Enterprise Onboarding",
        id: "TRJ-0073",
        agent: "Onboarding Agent",
        initials: "OA",
        status: "Running",
        duration: "7m 04s",
      },
      {
        name: "Ops Health Check",
        id: "TRJ-0072",
        agent: "Ops Agent",
        initials: "OP",
        status: "Complete",
        duration: "4m 35s",
      },
      {
        name: "Data Stewardship",
        id: "TRJ-0071",
        agent: "Governance Agent",
        initials: "GA",
        status: "Escalated",
        duration: "5m 18s",
      },
      {
        name: "Forecast Review",
        id: "TRJ-0070",
        agent: "Planning Agent",
        initials: "PA",
        status: "Awaiting approval",
        duration: "8m 02s",
      },
    ],
    incidents: [
      {
        name: "Repeated replans",
        agent: "Planning Agent",
        time: "Yesterday",
        severity: "high",
        detail: "A branching task retried the same tool chain too often.",
      },
      {
        name: "Escalation spike",
        agent: "Onboarding Agent",
        time: "2d ago",
        severity: "critical",
        detail: "A burst of approvals hinted at missing prechecks.",
      },
      {
        name: "Policy override attempt",
        agent: "Ops Agent",
        time: "4d ago",
        severity: "medium",
        detail: "The agent tried to widen its resource scope.",
      },
    ],
    auditLog: [
      { time: "-6m", message: "Monthly benchmark published", tag: "ok" },
      { time: "-11m", message: "Escalation threshold updated", tag: "ok" },
      { time: "-19m", message: "Replay session archived", tag: "warn" },
      { time: "-25m", message: "Trajectory completed", tag: "ok" },
      {
        time: "-39m",
        message: "Long-running plan entered recovery",
        tag: "warn",
      },
    ],
    insights: [
      {
        value: "22%",
        label: "Lower failure rate",
        text: "Verification and fallback branches cut obvious failures.",
        trend: "up",
      },
      {
        value: "12",
        label: "Vertex ceiling",
        text: "Longer trajectories still correlate with lower completion quality.",
        trend: "down",
      },
      {
        value: "37%",
        label: "Faster recovery",
        text: "Recovery vertices shortened time to a successful close.",
        trend: "up",
      },
    ],
    agents: [
      {
        name: "Onboarding Agent",
        status: "Stable",
        load: "58%",
        success: "97%",
        note: "Most efficient when the plan is explicit.",
      },
      {
        name: "Ops Agent",
        status: "Stable",
        load: "69%",
        success: "95%",
        note: "Handles routine operations with few deviations.",
      },
      {
        name: "Planning Agent",
        status: "Needs review",
        load: "44%",
        success: "85%",
        note: "Too many recovery vertices still appear in long flows.",
      },
    ],
    liveFeed: [
      { time: "now", message: "Monthly insight model refreshed", tag: "ok" },
      {
        time: "31s",
        message: "Recovery branch recorded for TRJ-0073",
        tag: "warn",
      },
      { time: "58s", message: "Governance summary exported", tag: "ok" },
    ],
    policySummary: {
      headline: "The guardrails are stabilizing",
      details:
        "The system is catching more risky behavior earlier, but long trajectories still need review.",
      blocked: "174 blocked actions",
      approvals: "19 pending approvals",
    },
  },
};

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 26,
  mass: 0.8,
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springConfig,
  },
};

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

function trendIcon(trend: Trend) {
  if (trend === "up") {
    return <TrendingUp size={11} />;
  }

  if (trend === "down") {
    return <TrendingDown size={11} />;
  }

  return <Clock3 size={11} />;
}

export default function DashboardPage() {
  const user = useDashboardUser();
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("24h");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const frame = dashboardFrames[timeWindow];
  const displayName = user?.name?.split(" ")[0] || "Operator";
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "TR";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.section variants={cardReveal} id="overview" className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-15 w-15 rounded-none">
                <AvatarFallback className="rounded-none text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider"
                  >
                    Live operations
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {now.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-4xl">
                  <span className="text-muted-foreground">
                    {getGreeting(now)}
                  </span>
                  , {displayName}
                </h1>
              </div>
            </div>
            <p className="max-w-2xl text-xs text-muted-foreground">
              Understand, govern, and control how AI agents operate. This view
              keeps the trajectory graph, policy state, and incident trail
              aligned in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {windowOptions.map((option) => {
              const isActive = timeWindow === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeWindow(option.value)}
                  className="rounded-full px-4"
                >
                  <span>{option.label}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-widest opacity-70">
                    {option.hint}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {frame.metrics.map((metric) => (
            <Card
              key={metric.label}
              size="sm"
              className="relative overflow-hidden"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <CardAction>
                    <span className="text-muted-foreground">
                      {<metric.icon size={16} />}
                    </span>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light tracking-tight md:text-[28px]">
                    {metric.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      metric.trend === "up"
                        ? "text-success"
                        : metric.trend === "down"
                          ? "text-info"
                          : "text-muted-foreground"
                    }`}
                  >
                    {trendIcon(metric.trend)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <span
                  className={`text-xs leading-tight ${
                    metric.trend === "up"
                      ? "text-success"
                      : metric.trend === "down"
                        ? "text-info"
                        : "text-muted-foreground"
                  }`}
                >
                  {metric.change}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {pillarCards.map((pillar) => (
            <Card
              key={pillar.id}
              id={pillar.id}
              size="sm"
              className="group/card border-border/60 transition-colors hover:border-foreground/20"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm">{pillar.title}</CardTitle>
                  <CardAction>
                    <span className="text-muted-foreground/60 transition-colors group-hover/card:text-foreground">
                      <pillar.icon size={16} />
                    </span>
                  </CardAction>
                </div>
                <CardDescription className="text-xs">
                  {pillar.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-[11px] text-muted-foreground">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </motion.section>

      {/* xl:grid-cols-[1.4fr_.9fr]" */}
      <div className="grid gap-6">
        <motion.section
          variants={cardReveal}
          id="trajectory-graph"
          className="space-y-4"
        >
          <Card size="sm" className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="font-medium">
                    Trajectory graph
                  </CardTitle>
                  <CardDescription>{frame.subtitle}</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1.5 text-[10px]">
                  <span className="h-1.5 w-1.5 bg-current animate-pulse" />
                  {frame.title}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <Card className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
                      Declared plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 text-2xl font-light tracking-tight">
                      9 vertices
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
                      Observed path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 text-2xl font-light tracking-tight">
                      11 vertices
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/40">
                  <CardHeader>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Deviation
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-1 text-2xl font-light tracking-tight">
                      +2 recovery steps
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="flex min-w-max items-start gap-3">
                  {trajectoryGraph.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.title} className="flex items-center gap-3">
                        <div className="flex w-[180px] flex-col gap-auto border bg-background px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex h-9 w-9 items-center justify-center bg-muted text-muted-foreground">
                              <Icon size={16} />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {step.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {step.note}
                            </div>
                          </div>
                        </div>
                        {index < trajectoryGraph.length - 1 && (
                          <ArrowUpRight
                            size={18}
                            className="shrink-0 rotate-45 text-muted-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient-border">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Trajectory activity</CardTitle>
                  <CardDescription>
                    Recent runs from the selected window.
                  </CardDescription>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {frame.trajectories.length} records
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="w-8 px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        #
                      </th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Trajectory
                      </th>
                      <th className="hidden px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                        Agent
                      </th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="hidden px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {frame.trajectories.map((trajectory, index) => (
                      <tr
                        key={trajectory.id}
                        className="group border-b border-border/30 last:border-b-0 transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 text-[10px] tabular-nums text-muted-foreground/50">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar size="sm">
                              <AvatarFallback className="bg-muted text-[9px] font-medium text-muted-foreground transition-colors group-hover:bg-foreground/10">
                                {trajectory.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium leading-tight">
                                {trajectory.name}
                              </div>
                              <div className="text-[9px] text-muted-foreground">
                                {trajectory.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3 sm:table-cell">
                          <Badge
                            variant="secondary"
                            className="gap-1.5 text-[10px] px-2 py-0.5"
                          >
                            <span className="h-1 w-1 rounded-full bg-foreground/30" />
                            {trajectory.agent}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={statusVariant[trajectory.status]}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5"
                          >
                            {trajectory.status === "Running" && (
                              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            )}
                            {trajectory.status === "Complete" && (
                              <CheckCircle2 size={10} />
                            )}
                            {trajectory.status === "Escalated" && (
                              <AlertTriangle size={10} />
                            )}
                            {trajectory.status === "Awaiting approval" && (
                              <Clock3 size={10} />
                            )}
                            {trajectory.status}
                          </Badge>
                        </td>
                        <td className="hidden px-4 py-3 text-right text-xs tabular-nums text-muted-foreground sm:table-cell">
                          {trajectory.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          variants={cardReveal}
          id="live-feed"
          className="space-y-4 w-full"
        >
          {/* <Card size="sm" className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Live feed</CardTitle>
                  <CardDescription>
                    The current window updates as trajectories move.
                  </CardDescription>
                </div>
                <Badge variant="default" className="gap-1.5 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Streaming
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {frame.liveFeed.map((event) => (
                  <div
                    key={`${event.time}-${event.message}`}
                    className="flex items-start gap-3 px-3 py-3"
                  >
                    <div className="mt-0.5 text-[10px] tabular-nums text-muted-foreground/60">
                      {event.time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] leading-relaxed">
                        {event.message}
                      </div>
                    </div>
                    <Badge
                      variant={tagBadge[event.tag]}
                      className="h-5 px-1.5 text-[8px] uppercase tracking-widest"
                    >
                      {event.tag}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card size="sm" id="governance" className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="space-y-1">
                <CardTitle className="text-sm">Governance</CardTitle>
                <CardDescription>
                  Policy summaries and approval pressure at a glance.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border bg-background p-3.5">
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {frame.policySummary.headline}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {frame.policySummary.details}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border bg-muted/30 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Blocked
                  </div>
                  <div className="mt-1 text-lg font-light tracking-tight">
                    {frame.policySummary.blocked}
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3.5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Approvals
                  </div>
                  <div className="mt-1 text-lg font-light tracking-tight">
                    {frame.policySummary.approvals}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card size="sm" id="incidents" className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Recent incidents</CardTitle>
                  <CardDescription>
                    Events that need operational attention.
                  </CardDescription>
                </div>
                <Badge
                  variant="destructive"
                  className="text-[9px] px-1.5 py-0 h-4"
                >
                  {frame.incidents.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {frame.incidents.map((incident) => (
                  <div key={incident.name} className="flex gap-3 px-3 py-3">
                    <div className="mt-1 shrink-0">
                      <div
                        className={`h-2 w-2 rounded-full ${severityColor[incident.severity]} ring-2 ring-background`}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[11px] font-medium">
                          {incident.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="h-4 px-1.5 text-[8px] uppercase tracking-wider"
                        >
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {incident.detail}
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                        <span>{incident.agent}</span>
                        <span className="text-muted-foreground/40">·</span>
                        <span>{incident.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </motion.section>
      </div>

      <div className="grid gap-6 xl:grid-cols-1">
        <motion.section
          variants={cardReveal}
          id="audit-log"
          className="space-y-4"
        >
          <Card size="sm" className="card-gradient-border">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Audit log</CardTitle>
                  <CardDescription>
                    A compact record of the latest system events.
                  </CardDescription>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {frame.auditLog.length} events
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {frame.auditLog.map((event) => (
                  <div
                    key={`${event.time}-${event.message}`}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    <span className="min-w-[34px] shrink-0 text-xs font-mono tabular-nums text-muted-foreground/60">
                      {event.time}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs leading-relaxed">
                      {event.message}
                    </span>
                    <Badge
                      variant={tagBadge[event.tag]}
                      className="text-[10px] font-semibold! uppercase tracking-widest"
                    >
                      {event.tag}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={cardReveal} id="agents" className="space-y-4">
          <Card className="card-gradient-border">
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-sm">Agent health</CardTitle>
                <CardDescription>
                  Fleet-level success and load across the selected window.
                </CardDescription>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="grid grid-cols-3 gap-6 space-y-3">
              {frame.agents.map((agent) => (
                <div key={agent.name} className="border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{agent.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {agent.note}
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === "Needs review"
                          ? "outline"
                          : "secondary"
                      }
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <Card className="bg-background p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Load
                      </div>
                      <div className="mt-1 text-lg font-light tracking-tight">
                        {agent.load}
                      </div>
                    </Card>
                    <Card className="bg-background p-3">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Success
                      </div>
                      <div className="mt-1 text-lg font-light tracking-tight">
                        {agent.success}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* <motion.section
        variants={cardReveal}
        id="improve"
        className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]"
      >
        <Card className="card-gradient-border">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle className="text-sm">Trajectory insights</CardTitle>
              <CardDescription>
                Patterns that explain why certain trajectories perform better.
              </CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            {frame.insights.map((insight) => (
              <div
                key={insight.label}
                className="rounded-2xl border bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {insight.label}
                  </div>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded ${
                      insight.trend === "up"
                        ? "bg-success/10 text-success"
                        : insight.trend === "down"
                          ? "bg-info/10 text-info"
                          : "bg-warning/10 text-warning"
                    }`}
                  >
                    {trendIcon(insight.trend)}
                  </span>
                </div>
                <div className="mt-3 text-2xl font-light tracking-tight">
                  {insight.value}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {insight.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-gradient-border">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle className="text-sm">What changed</CardTitle>
              <CardDescription>
                The selected window shows where the system is drifting or
                improving.
              </CardDescription>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 p-4 pt-3">
            <div className="rounded-2xl border bg-background p-4">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                The central object is the trajectory graph
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The dashboard now centers the observed execution path, makes
                commitment deviation visible, and keeps governance outcomes tied
                to real operations.
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Key shift
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Logs became operational intelligence instead of a passive list,
                and the overview now reflects how Trajeckt is actually used.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section> */}
    </motion.div>
  );
}
