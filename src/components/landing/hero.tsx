"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import { motion, animate, useInView } from "motion/react";
import { RequestDemoButton } from "@/components/request-demo-modal";

const proofPoints = [
  { label: "Declared plan", value: "9 vertices" },
  { label: "Observed", value: "11 vertices" },
  { label: "Deviation", value: "+2 recovery" },
  { label: "Commitment match", value: "96%" },
];

const stats = [
  { value: "100%", label: "probe actions blocked", isNumeric: true },
  { value: "96.7%", label: "in plan calls allowed", isNumeric: true },
  { value: "<2ms", label: "decision latency P95", isNumeric: false },
  { value: "20/20", label: "plans verified", isNumeric: false },
];

const networkNodes = [
  { id: 0, x: 80, y: 140, r: 3 },
  { id: 1, x: 260, y: 90, r: 4 },
  { id: 2, x: 440, y: 150, r: 3 },
  { id: 3, x: 620, y: 80, r: 5 },
  { id: 4, x: 800, y: 130, r: 3 },
  { id: 5, x: 980, y: 70, r: 4 },
  { id: 6, x: 1160, y: 140, r: 3 },
  { id: 7, x: 1340, y: 90, r: 3 },
  { id: 8, x: 180, y: 270, r: 4 },
  { id: 9, x: 370, y: 230, r: 5 },
  { id: 10, x: 550, y: 290, r: 4 },
  { id: 11, x: 740, y: 240, r: 5 },
  { id: 12, x: 920, y: 300, r: 4 },
  { id: 13, x: 1100, y: 250, r: 4 },
  { id: 14, x: 1280, y: 310, r: 3 },
  { id: 15, x: 120, y: 430, r: 3 },
  { id: 16, x: 310, y: 390, r: 4 },
  { id: 17, x: 500, y: 450, r: 5 },
  { id: 18, x: 680, y: 400, r: 4 },
  { id: 19, x: 870, y: 460, r: 3 },
  { id: 20, x: 1060, y: 410, r: 4 },
  { id: 21, x: 1250, y: 470, r: 3 },
  { id: 22, x: 230, y: 570, r: 3 },
  { id: 23, x: 420, y: 540, r: 4 },
  { id: 24, x: 610, y: 590, r: 3 },
  { id: 25, x: 790, y: 550, r: 4 },
  { id: 26, x: 980, y: 600, r: 3 },
  { id: 27, x: 360, y: 690, r: 3 },
  { id: 28, x: 560, y: 660, r: 4 },
  { id: 29, x: 760, y: 710, r: 3 },
  { id: 30, x: 680, y: 780, r: 3 },
];

const flows = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 8],
  [1, 9],
  [2, 9],
  [3, 10],
  [4, 11],
  [5, 12],
  [6, 13],
  [7, 14],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [8, 15],
  [9, 16],
  [10, 17],
  [11, 18],
  [12, 19],
  [13, 20],
  [14, 21],
  [15, 16],
  [16, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [20, 21],
  [15, 22],
  [16, 22],
  [16, 23],
  [17, 24],
  [18, 25],
  [19, 25],
  [20, 26],
  [22, 23],
  [23, 24],
  [24, 25],
  [25, 26],
  [22, 27],
  [23, 28],
  [24, 28],
  [25, 29],
  [26, 29],
  [27, 28],
  [28, 29],
  [27, 30],
  [28, 30],
  [29, 30],
];

const hubs = [3, 9, 11, 17, 24, 28];

function getEdgePath(
  n1: { x: number; y: number },
  n2: { x: number; y: number },
) {
  const dx = n2.x - n1.x;
  const dy = n2.y - n1.y;
  const cpx = n1.x + dx / 2;
  const cpy = n1.y + dy / 2 + Math.abs(dx) * 0.08;
  return `M ${n1.x} ${n1.y} Q ${cpx} ${cpy} ${n2.x} ${n2.y}`;
};

function AnimatedStat({ value, label, isNumeric }: { value: string; label: string, isNumeric: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = Number.parseFloat(value);
  const isPercent = value.endsWith("%");

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    const controls = animate(0, numericValue, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest * 10) / 10),
    });
    return controls.stop;
  }, [isInView, numericValue]);

  const rendered = isNumeric ? `${Number.isInteger(displayValue) ? Math.round(displayValue) : displayValue.toFixed(1)}${isPercent ? "%" : ""}` : value;

  return (
    <div ref={ref}>
      <div className="text-lg font-semibold tracking-[-0.04em] tabular-nums">
        {isInView ? (
          <>
            {rendered}
            </>
        ) : (
        "0"
        )}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden bg-background pt-20 sm:pt-24 lg:pt-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="mx-auto h-full max-w-7xl px-u1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, color-mix(in srgb, currentColor 4%, transparent) 0 1px, transparent 1px calc(100% / 12))",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="uppercase inline-flex items-center gap-2.5 bg-background px-4 py-1.5 text-[10px] text-muted-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-foreground/40 opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-foreground" />
          </span>
          Runtime Enforcement For AI Agents
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={mounted ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-heading"
        >
          <span className="text-foreground">
            A single tool call is<br /> rarely the problem
          </span>
          <span className="block text-foreground/70">The sequence is.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.16, duration: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
        >
          Every agent guardrail today inspects actions one at a time — so the
          failures that only exist across steps walk right through. Trajeckt
          enforces commitments across the whole trajectory, at runtime, below
          the model, before any irreversible action fires.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <RequestDemoButton
            size="lg"
            className="group relative overflow-hidden rounded-none border border-foreground bg-foreground text-background text-base hover:bg-foreground"
          >
            <span className="relative z-10 flex items-center gap-2">
              Request Demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </RequestDemoButton>
          <Button
            variant="outline"
            size="lg"
            className="rounded-none border-border text-base"
            render={<Link href="#intelligence" />}
          >
            See it Blocked
            <ArrowRight className="ml-3 h-4 w-4" />
          </Button>
        </motion.div>

        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 border border-border bg-background shadow-[0_20px_60px_-52px_hsl(var(--foreground)/0.24)]"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`px-4 py-3 text-left ${
                    index < 2 ? "border-b" : ""
                  } ${
                    index % 2 === 0 ? "border-r" : ""
                  } sm:border-b-0 sm:border-r sm:last:border-r-0 border-border`}
                >
                  <AnimatedStat value={stat.value} label={stat.label} isNumeric={stat.isNumeric} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
