"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { Switch } from "@tamor/ui/components/switch";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const trajectNavItems = [
  { id: "hero",         name: "01 hero"         },
  { id: "proof",        name: "02 proof"        },
  { id: "capabilities", name: "03 capabilities" },
  { id: "integrate",    name: "04 integrate"    },
  { id: "action", name: "05 action" }
] as const;

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="relative border-t bg-background"
    >
      <div className="relative mx-auto max-w-7xl px-u1">

        {/* BAND 1: identity row */}
        <div className="flex items-start justify-between pt-u3 pb-u2">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.png" width={30} height={30} alt="Trajeckt" />
            </Link>
            <p className="mt-u05 font-mono text-small text-muted-foreground">
              Agent operations, without the guesswork.
            </p>
          </div>
          <div className="flex items-start">
            <div>
              <div className="text-micro uppercase tracking-wider text-muted-foreground mb-u0.5">
                CONTACT
              </div>
              <a
                href="mailto:founders@trajeckt.com"
                className="font-mono text-small text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
              >
                sandipgyawali100@gmail.com
              </a>
            </div> 
           </div>
        </div>

        {/* BAND 2: trajectory row, navigation above the monument */}
        <div className="flex items-center gap-x-2 border-t border-border h-u2 font-mono text-small">
          <span className="text-micro uppercase tracking-wider text-muted-foreground shrink-0 mr-2">
            TRAJECTORY
          </span>
          {trajectNavItems.map((item, i) => (
            <Fragment key={item.id}>
              {i > 0 && (
                <span className="text-muted-foreground/60" aria-hidden="true">
                  →
                </span>
              )}
              <a
                href={`#${item.id}`}
                className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
              >
                {item.name}
              </a>
            </Fragment>
          ))}
          <span className="ml-auto text-muted-foreground shrink-0">
            ✓ plan held
          </span>
        </div>

        {/* BAND 3 / monument: crop is in the viewBox coordinates, not CSS */}
        <div
          className="text-foreground/[0.10] dark:text-foreground/[0.12] leading-none mt-0 mb-0"
          aria-hidden="true"
          style={{
            WebkitMaskImage:
              "repeating-linear-gradient(to bottom, black 0 18px, transparent 18px 24px)",
            maskImage:
              "repeating-linear-gradient(to bottom, black 0 18px, transparent 18px 24px)",
          }}
        >
          <svg
            viewBox="0 0 1000 140"
            className="block w-full"
            preserveAspectRatio="none"
          >
            <text
              x="0"
              y="215"
              fontSize="220"
              fontWeight="700"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              letterSpacing="-0.02em"
              fill="currentColor"
              className="font-heading"
            >
              Trajeckt
            </text>
          </svg>
        </div>

        {/* BAND 4: signature, border-t touches the monument's bottom edge */}
        <div className="flex items-center justify-between border-t border-border py-u1 font-mono text-micro text-muted-foreground">
          <span className="whitespace-nowrap">&copy; 2026 Trajeckt. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Switch onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}/>    
            <span className="text-muted-foreground text-micro font-mono">Theme</span> 
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
