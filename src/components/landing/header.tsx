"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Button } from "@tamor/ui/components/button";
import Image from "next/image";
import { RequestDemoButton } from "@/components/request-demo-modal";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Intelligence", href: "#intelligence" },
  { name: "Docs", href: "/docs" },
];

const springConfig = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 border-b`}
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
            <Image src="/logo.png" width={40} height={40} alt="tamor-logo" />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative px-4 py-2 text-sm text-muted-foreground font-medium transition-colors hover:text-foreground"
            >
              {link.name}
              <motion.span
                className="absolute inset-x-4 bottom-1 h-px origin-left bg-foreground"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springConfig}
          >
            <RequestDemoButton
              size="lg"
              className="group relative overflow-hidden rounded-none px-4"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Request Demo
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </RequestDemoButton>
          </motion.div>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-none"
                  render={<Link href="/auth/login" />}
                >
                  Sign in
                </Button>
                <RequestDemoButton
                  className="flex-1 rounded-none"
                  onClick={() => setIsOpen(false)}
                >
                  Request demo
                </RequestDemoButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
