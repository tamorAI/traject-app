"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCompleteOnboarding, useSession } from "@/hooks/use-auth";
import { Button } from "@tamor/ui/components/button";

const springConfig = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

export default function OnboardingHeader() {
  const { data: session } = useSession();
  const complete = useCompleteOnboarding();

  const handleSkip = () => {
    const defaultName = session?.user?.name
      ? `${session.user.name.split(" ")[0]}'s Workspace`
      : "My Workspace";
    complete.mutate({ name: defaultName });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b"
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block absolute left-[0.5px] bottom-0 -translate-x-1/2 translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none pointer-events-none select-none z-10">
          +
        </div>
        <div className="hidden lg:block absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none pointer-events-none select-none z-10">
          +
        </div>

        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={springConfig}
          >
            <Image src="/logo.png" width={40} height={40} alt="Trajeckt" />
          </motion.div>
        </Link>

        <div aria-label="Onboarding progress">
          <ol className="flex flex-nowrap gap-1">
            <li className="h-1 w-16 rounded-full bg-primary" />
          </ol>
        </div>

        <Button
         variant="link"
          onClick={handleSkip}
          disabled={complete.isPending}
        >
          Skip to dashboard
        </Button>
      </div>
    </motion.header>
  );
}
