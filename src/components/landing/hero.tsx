"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { FadeContainer, FadeDiv, FadeSpan } from "./Fade";

function TrajectoryGraph() {
  const graphRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);
  const translateX = useTransform(springX, [0, 1], [-15, 15]);
  const translateY = useTransform(springY, [0, 1], [-10, 10]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const nodes = [
    { id: 0, cx: 120, cy: 330, label: "User Request", type: "start" },
    { id: 1, cx: 300, cy: 210, label: "Plan & Decompose" },
    { id: 2, cx: 500, cy: 340, label: "Search" },
    { id: 3, cx: 700, cy: 210, label: "Analyze" },
    { id: 4, cx: 900, cy: 320, label: "Validate" },
    { id: 5, cx: 1080, cy: 230, label: "Result", type: "end" },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ];

  function getPath(
    p1: { cx: number; cy: number },
    p2: { cx: number; cy: number },
  ) {
    const dx = p2.cx - p1.cx;
    const cpx1 = p1.cx + dx * 0.3;
    const cpx2 = p2.cx - dx * 0.3;
    return `M ${p1.cx} ${p1.cy} C ${cpx1} ${p1.cy}, ${cpx2} ${p2.cy}, ${p2.cx} ${p2.cy}`;
  }

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <motion.div
      ref={graphRef}
      style={{ rotateX, rotateY, x: translateX, y: translateY }}
      className="relative w-full h-full"
    >
      <svg
        viewBox="0 0 1200 540"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-subtle">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map(([i1, i2]) => {
          const n1 = nodes[i1];
          const n2 = nodes[i2];
          const path = getPath(n1, n2);
          const isActive = hoveredNode === i1 || hoveredNode === i2;
          return (
            <g key={`edge-${i1}-${i2}`}>
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeOpacity={isActive ? 0.3 : 0.08}
                strokeWidth={isActive ? 1.5 : 1}
                className="transition-all duration-300"
              />
              <motion.path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="4 8"
                animate={{ strokeDashoffset: [0, -12] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}

        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isStart = node.type === "start";
          const isEnd = node.type === "end";
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={isStart || isEnd ? 7 : 5}
                fill="currentColor"
                className="text-foreground"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + node.id * 0.08, duration: 0.4 }}
                animate={{
                  scale: isHovered ? 2 : 1,
                }}
              />

              {isHovered && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-foreground/20"
                />
              )}

              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={isStart || isEnd ? 7 : 5}
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className="text-foreground/20"
                animate={{
                  r: isStart || isEnd ? [7, 10, 7] : [5, 7.5, 5],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.id * 0.3,
                }}
              />

              {(isStart || isEnd) && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={12}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  className="text-foreground/10"
                  animate={{
                    r: [12, 20, 12],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              <motion.text
                x={node.cx}
                y={node.cy + (isStart || isEnd ? 22 : 18)}
                textAnchor="middle"
                fill="currentColor"
                className="text-muted-foreground/60 text-[8px] tracking-wide"
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + node.id * 0.08, duration: 0.3 }}
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="w-full max-w-5xl px-4 opacity-40 dark:opacity-50">
          <TrajectoryGraph />
        </div>
      </div>

      <FadeContainer className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-24 text-center">
        <FadeDiv>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Agent operations platform
          </div>
        </FadeDiv>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
          <FadeSpan>Understand,</FadeSpan>{" "}
          <FadeSpan>govern,</FadeSpan>{" "}
          <FadeSpan>and</FadeSpan>{" "}
          <FadeSpan>control</FadeSpan>
          <br />
          <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground/60 bg-clip-text text-transparent">
            <FadeSpan>how</FadeSpan>{" "}
            <FadeSpan>AI</FadeSpan>{" "}
            <FadeSpan>agents</FadeSpan>{" "}
            <FadeSpan>operate.</FadeSpan>
          </span>
        </h1>

        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[3px] h-[1.1em] bg-foreground/70 ml-0.5 align-middle"
        />

        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          <FadeSpan>
            Observe every decision path, set boundaries before execution, and
            turn every agent trajectory into operational intelligence.
          </FadeSpan>
        </p>

        <FadeDiv>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group relative overflow-hidden text-base"
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
              className="group text-base"
              render={<Link href="#features" />}
            >
              <Play className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              View demo
            </Button>
          </div>
        </FadeDiv>

        <FadeDiv>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-success" />
              No credit card required
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-success" />
              14-day free trial
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-success" />
              SOC 2 compliant
            </span>
          </div>
        </FadeDiv>
      </FadeContainer>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
