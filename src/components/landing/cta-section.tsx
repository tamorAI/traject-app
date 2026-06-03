"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@tamor/ui/components/button";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";

const trustItems = [
  "Trajectory-based analytics",
  "Offline-first architecture",
  "SOC 2 compliant",
  "Unlimited agents",
];

function FloatingDot({
  className,
  duration,
  xRange,
  yRange,
  delay = 0,
}: {
  className: string;
  duration: number;
  xRange: number[];
  yRange: number[];
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        x: xRange,
        y: yRange,
        scale: [1, 1.3, 0.8, 1],
        opacity: [0.3, 0.7, 0.2, 0.3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
        delay,
      }}
    />
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 150;
    const strength = Math.min(1, Math.max(0, 1 - dist / maxDist));
    x.set(dx * 0.25 * strength);
    y.set(dy * 0.25 * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const cardY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20"
        style={{ y: bgY, opacity: bgOpacity }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <FloatingDot
          className="h-2 w-2 bg-success/20"
          duration={6}
          xRange={[0, 40]}
          yRange={[0, -30]}
        />
        <FloatingDot
          className="h-1.5 w-1.5 bg-info/20"
          duration={8}
          xRange={[0, -50]}
          yRange={[0, 40]}
          delay={1}
        />
        <FloatingDot
          className="h-3 w-3 bg-warning/15"
          duration={7}
          xRange={[0, 30]}
          yRange={[0, -50]}
          delay={2}
        />
        <FloatingDot
          className="h-1 w-1 bg-foreground/10"
          duration={9}
          xRange={[0, -35]}
          yRange={[0, -25]}
          delay={0.5}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 0.3]) }}
      >
        <motion.div
          className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-r from-success/5 via-info/5 to-warning/5 blur-[100px]"
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "10%", "-10%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center"
        style={{ y: cardY, opacity: cardOpacity }}
      >
        <motion.div
          className="rounded-3xl border border-border/50 bg-card p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px hsl(var(--foreground) / 0.08)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/[0.02] via-transparent to-info/[0.02]" />
          </motion.div>

          <motion.div
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
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3 w-3" />
            Get started
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Ready to understand
            <br />
            your agents?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="mx-auto mt-4 max-w-lg text-muted-foreground"
          >
            Start your free trial. No credit card required. Deploy in minutes,
            not days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 1,
            }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton>
              <Button
                size="lg"
                className="group relative overflow-hidden text-base"
                render={<Link href="/auth/signup" />}
              >
                <motion.span
                  className="absolute inset-0 bg-foreground/5"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Start free trial
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 2,
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </span>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="group text-base"
                render={<Link href="/auth/login" />}
              >
                Sign in
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            {trustItems.map((item, i) => (
              <motion.span
                key={item}
                className="flex items-center gap-1.5"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4 }}
              >
                <motion.span
                  className="h-1 w-1 rounded-full bg-success"
                  animate={{ scale: [1, 1.6, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
