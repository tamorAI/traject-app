"use client";

import Link from "next/link";
import { motion } from "motion/react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Platform", href: "#platform" },
      { name: "Intelligence", href: "#intelligence" },
      { name: "Sign in", href: "/auth/login" },
    ],
  },
  {
    title: "Get started",
    links: [
      { name: "Start free trial", href: "/auth/signup" },
      { name: "Request demo", href: "/auth/signup" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Landing", href: "/" },
      { name: "Request demo", href: "/auth/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="relative border-t bg-background/60"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:block absolute left-[0.5px] top-0 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none pointer-events-none select-none z-10">
          +
        </div>
        <div className="hidden lg:block absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-muted-foreground/50 font-bold text-2xl leading-none pointer-events-none select-none z-10">
          +
        </div>
        <div className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="max-w-xl">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center border border-border/70 bg-foreground text-background">
                <span className="text-sm font-semibold tracking-tight">T</span>
              </span>
              <div>
                <div className="text-sm font-medium tracking-[0.18em] uppercase text-muted-foreground">
                  Trajeckt
                </div>
                <div className="text-xs text-muted-foreground/70">
                  Understand, govern, and control how AI agents operate.
                </div>
              </div>
            </Link>

            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Built for teams that need to observe execution, enforce
              guardrails, and improve agent performance over time.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {[
                "Trajectory visibility",
                "Governance",
                "Replay",
                "Learning",
              ].map((item) => (
                <span
                  key={item}
                  className="border border-border/70 bg-background/70 px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {group.title}
                </div>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{link.name}</span>
                        <span className="h-px w-4 origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/60 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Trajeckt. All rights reserved.
          </p>
          <p>Agent operations, without the guesswork.</p>
        </div>
      </div>
    </motion.footer>
  );
}
