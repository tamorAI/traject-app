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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

function FloatingDot({
  className,
  duration,
  xRange,
  yRange,
}: {
  className: string;
  duration: number;
  xRange: number[];
  yRange: number[];
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        x: xRange,
        y: yRange,
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
      }}
    />
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    x.set(dx * 0.2);
    y.set(dy * 0.2);
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
      whileTap={{ scale: 0.98 }}
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
  const cardY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
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
        />
        <FloatingDot
          className="h-3 w-3 bg-warning/15"
          duration={7}
          xRange={[0, 30]}
          yRange={[0, -50]}
        />
        <FloatingDot
          className="h-1 w-1 bg-foreground/10"
          duration={9}
          xRange={[0, -35]}
          yRange={[0, -25]}
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
          className="rounded-3xl border border-border/50 bg-card p-8 sm:p-12 lg:p-16 transition-shadow duration-500 hover:shadow-lg relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-success/[0.02] via-transparent to-info/[0.02]" />
          </motion.div>

          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground"
            variants={itemVariants}
          >
            <Sparkles className="h-3 w-3" />
            Get started
          </motion.div>

          <motion.h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            variants={itemVariants}
          >
            Ready to understand
            <br />
            your agents?
          </motion.h2>

          <motion.p
            className="mx-auto mt-4 max-w-lg text-muted-foreground"
            variants={itemVariants}
          >
            Start your free trial. No credit card required. Deploy in minutes,
            not days.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <MagneticButton>
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
            </MagneticButton>
            <MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="text-base"
                render={<Link href="/auth/login" />}
              >
                Sign in
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
            variants={itemVariants}
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
                  animate={{ scale: [1, 1.5, 1] }}
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
