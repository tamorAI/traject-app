"use client";
import { motion, type Variants } from "motion/react";

const springConfig = {
  type: "spring" as const,
  stiffness: 180,
  damping: 20,
  mass: 1.2,
};

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(6px)",
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ...springConfig,
    },
  },
};

const itemFast: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(3px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      mass: 0.8,
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      ...springConfig,
    },
  },
};

function FadeContainer({
  children,
  className,
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeDiv({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

function FadeSpan({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span variants={item} className={className}>
      {children}
    </motion.span>
  );
}

function FadeInScale({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={scaleIn} className={className}>
      {children}
    </motion.div>
  );
}

function FadeInFast({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemFast} className={className}>
      {children}
    </motion.div>
  );
}

export { FadeContainer, FadeDiv, FadeSpan, FadeInScale, FadeInFast };
