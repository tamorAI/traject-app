"use client";

import Link from "next/link";
import { motion } from "motion/react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Intelligence", href: "#intelligence" },
      { name: "Documentation", href: "/docs" },
      { name: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
    ],
  },
];

const linkVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
                mass: 1,
              }}
              className="lg:col-span-2"
            >
              <Link href="/" className="group flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-sm font-bold"
                >
                  T
                </motion.div>
                <motion.span
                  className="text-lg font-semibold tracking-tight"
                  whileHover={{ letterSpacing: "0.02em" }}
                  transition={{ duration: 0.3 }}
                >
                  Trajeckt
                </motion.span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Understand, govern, and control how AI agents operate.
              </p>
            </motion.div>

            {footerLinks.map((group) => (
              <div key={group.title}>
                <motion.h4
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {group.title}
                </motion.h4>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link, i) => (
                    <motion.li
                      key={link.name}
                      custom={i}
                      variants={linkVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="group relative inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                        <motion.span
                          className="absolute -bottom-0.5 left-0 h-px bg-foreground"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{
                            duration: 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="border-t border-border/50 py-6"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Trajeckt. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
