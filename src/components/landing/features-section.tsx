"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
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

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(springY, [0, 1], [4, -4]);
  const rotateY = useTransform(springX, [0, 1], [-4, 4]);

  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  const glareOpacity = useTransform(
    springX,
    [0, 0.5, 1],
    [0.3, 0, 0.3],
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className={className}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, hsl(var(--foreground) / 0.06), transparent 60%)`,
          opacity: glareOpacity,
        }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            Four pillars
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
            Complete agent operations
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
            From observation to improvement — a unified platform for
            understanding and controlling AI agent behavior.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  mass: 1,
                }}
              >
                <TiltCard className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg">
                  <motion.div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                    whileHover={{ scale: 1.1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="text-lg font-semibold">{pillar.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pillar.summary}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {pillar.points.map((point, i) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + index * 0.05 + i * 0.03,
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <motion.span
                          className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40"
                          whileHover={{ scale: 2, backgroundColor: "hsl(var(--foreground) / 0.6)" }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                          }}
                        />
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 180,
            damping: 20,
            mass: 1,
          }}
          className="mt-12 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              variant="outline"
              className="group relative overflow-hidden"
              render={<Link href="/auth/signup" />}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore all features
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
