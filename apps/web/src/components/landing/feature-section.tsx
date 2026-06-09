"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Cog } from "lucide-react";

const PILLARS = [
  {
    index: "01",
    name: "Enforce",
    summary:
      "Every tool call is checked against the declared plan before it executes. Position in the sequence determines allow or block, not a static allowlist.",
    headerRight: "run-20260604-152135",
  },
  {
    index: "02",
    name: "Observe",
    summary:
      "Every execution creates a structured timeline of decisions, transitions, and outcomes you can inspect.",
    headerRight: "deploy run",
  },
  {
    index: "03",
    name: "Investigate",
    summary:
      "Replay any run. Trace every decision. Understand exactly what happened and why, without reconstructing from raw logs.",
    headerRight: "decision record",
  },
  {
    index: "04",
    name: "Benchmark",
    summary:
      "Every number on this page traces to a fixed benchmark run, measured against real tasks, not simulated scenarios.",
    headerRight: "20 tasks · fixed harness",
  },
] as const;

// ── Panel bodies ──────────────────────────────────────────────────────────────

function EnforceBody() {
  return (
    <div className="font-mono text-mono">
      <div className="text-muted-foreground mb-[6px] leading-[24px]">
        plan: crm.read → invoices.read → report.write
      </div>
      <div className="flex items-baseline justify-between gap-u1 leading-[24px]">
        <span className="text-foreground">crm.read</span>
        <span className="text-muted-foreground/40 shrink-0">· allowed</span>
      </div>
      <div className="flex items-baseline justify-between gap-u1 leading-[24px]">
        <span className="text-foreground">invoices.read</span>
        <span className="text-muted-foreground/40 shrink-0">· allowed</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-u05 gap-y-0 leading-[24px]">
        <span className="text-foreground">email.send</span>
        <span className="bg-signal text-background px-u05 text-micro uppercase shrink-0 leading-none py-[3px]">
          BLOCKED
        </span>
        <span className="text-signal">no valid transition in declared plan</span>
      </div>
      <div className="flex items-baseline justify-between gap-u1 leading-[24px]">
        <span className="text-foreground">report.write</span>
        <span className="text-muted-foreground/40 shrink-0">· allowed</span>
      </div>
      <div className="mt-u1 pt-u1 border-t border-border text-muted-foreground leading-[24px]">
        3 allowed · 1 blocked
      </div>
    </div>
  );
}

const OBSERVE_ROWS = [
  { step: "read_ci_status",      run: "✓ executed", time: "1.5ms", blocked: false, approved: false },
  { step: "deploy_production",   run: "→ ✓ executed", time: "",    blocked: false, approved: true  },
  { step: "email.send",          run: "✗ off plan",   time: "",    blocked: true,  approved: false },
  { step: "post_slack_releases", run: "✓ executed", time: "1.8ms", blocked: false, approved: false },
] as const;

function ObserveBody() {
  return (
    <div className="font-mono text-mono">
      {OBSERVE_ROWS.map((row) => (
        <div
          key={row.step}
          className="flex items-center justify-between gap-u05 leading-[24px]"
        >
          <span className={row.blocked ? "text-signal" : "text-foreground"}>
            {row.step}
          </span>
          <span className="flex items-center gap-u05 shrink-0">
            {row.approved && (
              <span className="bg-human text-background px-u05 text-micro uppercase leading-none py-[3px]">
                APPROVED
              </span>
            )}
            <span className={row.blocked ? "text-signal" : "text-muted-foreground/60"}>
              {row.run}
            </span>
            {row.time && (
              <span className="text-muted-foreground/40">{row.time}</span>
            )}
            {row.blocked && (
              <span className="bg-signal text-background px-u05 text-micro uppercase leading-none py-[3px]">
                BLOCKED
              </span>
            )}
          </span>
        </div>
      ))}
      <div className="mt-u1 pt-u1 border-t border-border text-muted-foreground/60 leading-[24px]">
        run complete · plan enforced · 1 approval
      </div>
    </div>
  );
}

const INVESTIGATE_REASONS = [
  {
    code: "no_valid_transition_in_declared_plan",
    body: "The step was not a legal move from where the agent stood.",
  },
  {
    code: "requires_human_approval",
    body: "Risk-tier tool: paused for a human before execution.",
  },
  {
    code: "plan_enforced",
    body: "Three allowed, one blocked, task completed.",
  },
] as const;

function InvestigateBody() {
  return (
    <div>
      {INVESTIGATE_REASONS.map((r, i) => (
        <div
          key={r.code}
          className={
            i < INVESTIGATE_REASONS.length - 1
              ? "pb-u05 mb-u05 border-b border-border"
              : ""
          }
        >
          <div className="font-mono text-mono text-foreground">{r.code}</div>
          <div className="text-small text-muted-foreground">{r.body}</div>
        </div>
      ))}
      <div className="mt-u1 pt-u1 border-t border-border text-small text-muted-foreground">
        every decision carries its reason; export the whole record as JSON
      </div>
    </div>
  );
}

const BENCHMARK_STATS = [
  { value: "100%",  label: "probe actions blocked" },
  { value: "96.7%", label: "in-plan allowed"       },
  { value: "<3ms",  label: "p95"                   },
  { value: "20/20", label: "plans verified"         },
] as const;

function BenchmarkBody() {
  return (
    <div>
      <div className="font-mono text-mono">
        {BENCHMARK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="grid grid-cols-[6ch_1fr] leading-[24px]"
          >
            <span className="text-foreground tabular-nums">{stat.value}</span>
            <span className="text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-u1 pt-u1 border-t border-border text-small text-muted-foreground">
        every number on this page traces to this run.
      </div>
    </div>
  );
}

const PANEL_BODIES = [EnforceBody, ObserveBody, InvestigateBody, BenchmarkBody];

// ── Main component ────────────────────────────────────────────────────────────

export default function FeatureSection() {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const SECTION_INTERVAL_MS = 5000;

  const select = useCallback((i: number) => {
    setActive(i);
    setUserInteracted(true);
  }, []);

  useEffect(() => {
    if (userInteracted) return;
    autoAdvanceTimer.current = setInterval(() => {
      setActive((a) => (a + 1) % PILLARS.length);
    }, SECTION_INTERVAL_MS);
    return () => {
      if (autoAdvanceTimer.current) clearInterval(autoAdvanceTimer.current);
    };
  }, [userInteracted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive((a) => (a + 1) % PILLARS.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((a) => (a - 1 + PILLARS.length) % PILLARS.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(PILLARS.length - 1);
      }
    },
    []
  );

  const pillar = PILLARS[active];

  return (
    <section id="capabilities" className="bg-surface-raised hatch py-u6">
      <div className="mx-auto max-w-7xl px-u1">
        {/* Section intro — sits above both columns */}
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Cog className="w-3.5 h-3.5" />
          Capabilities
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl font-heading"
        >
          One Enforcement Layer. <br />
          Everything else Follows.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base mb-u2"
        >
          Trajeckt turns executions into a structured evidence layer: live
          feeds, policy state, replay history, and the learning signals that
          shape better runs.
        </motion.p>

        {/* ── lg: two-column master-detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-u2">

          {/* LEFT: index (span-5) */}
          <div className="lg:col-span-5">
            {/* Mobile: horizontal scrollable tab row */}
            <div
              role="tablist"
              aria-label="Pillars"
              onKeyDown={handleKeyDown}
              className="flex lg:hidden overflow-x-auto gap-0 border-b border-border"
            >
              {PILLARS.map((p, i) => (
                <button
                  key={p.name}
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="pillars-panel"
                  id={`tab-${p.name.toLowerCase()}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                  className={[
                    "shrink-0 flex items-center gap-[6px] px-u1 py-u05 font-mono text-mono transition-colors duration-150 whitespace-nowrap border-b-2",
                    i === active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/70",
                  ].join(" ")}
                >
                  <span>{p.name}</span>
                </button>
              ))}
            </div>

            {/* Desktop: vertical index rows */}
            <div
              role="tablist"
              aria-label="Capability pillars"
              aria-orientation="vertical"
              onKeyDown={handleKeyDown}
              className="hidden lg:flex flex-col"
            >
              {PILLARS.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.name}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="pillars-panel"
                    id={`tab-${p.name.toLowerCase()}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(i)}
                    className={[
                      "text-left w-full py-u1 border-b border-border cursor-pointer",
                      "focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2 border-l-3 -ml-u1 pl-u1",
                      isActive
                        ? "bg-sidebar border-l-foreground"
                        : "border-l-transparent",
                    ].join(" ")}
                  >
                    <h3 className=" text-small font-semibold text-foreground">
                      {p.name}
                    </h3>
                    <p
                      className={[
                        "text-sm mt-[4px] transition-colors duration-150",
                        isActive
                          ? "text-foreground/80"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {p.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: instrument panel (span-7) */}
          <div className="lg:col-span-7">
            <div
              className="border border-border bg-background"
              id="pillars-panel"
              role="tabpanel"
              aria-labelledby={`tab-${pillar.name.toLowerCase()}`}
            >
              {/* Header bar h-u2 */}
              <div className="flex items-center justify-between border-b border-border px-u1 h-u2 shrink-0">
                <span className="font-mono text-micro uppercase text-foreground/60 tracking-widest">
                  {pillar.name}
                </span>
                <span className="font-mono text-micro text-muted-foreground">
                  {pillar.headerRight}
                </span>
              </div>

              {/* Body — all panels rendered in the same grid cell for constant height */}
              <div className="p-u1">
                <div className="grid">
                  {PANEL_BODIES.map((Body, i) => (
                    <div
                      key={i}
                      className={[
                        "[grid-area:1/1] transition-opacity duration-150",
                        i === active
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none select-none",
                      ].join(" ")}
                      aria-hidden={i !== active}
                    >
                      <Body />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
