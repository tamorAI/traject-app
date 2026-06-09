"use client";

import { motion } from "framer-motion";
import { LoginVideoBackground } from "@/components/login-vide-background";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function AuthPageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background flex relative"
    >
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <nav className="w-full pointer-events-none">
          <div className="relative py-3 xl:py-4 px-4 sm:px-4 md:px-4 lg:px-4 xl:px-6 2xl:px-8 flex items-center" />
        </nav>
      </div>

      <LoginVideoBackground />

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 pb-2">
        <div className="w-full max-w-md flex flex-col h-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 flex-1 flex flex-col justify-center"
          >
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h1 className="text-lg lg:text-2xl mb-4 font-semibold tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </motion.div>

            <motion.div variants={itemVariants}>{children}</motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-auto"
          >
            <p className="font-sans text-xs text-muted-foreground">
              By signing in you agree to our{" "}
              <Link
                href="https://midday.ai/terms"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Terms of service
              </Link>{" "}
              &{" "}
              <Link
                href="https://midday.ai/policy"
                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Privacy policy
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
