"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { useCompleteOnboarding } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { Building2, ArrowRight } from "lucide-react";

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64) || `org-${Date.now()}`
  );
}

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const complete = useCompleteOnboarding();

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setName(val);
      if (!slugEdited) {
        setSlug(slugify(val));
      }
    },
    [slugEdited],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    complete.mutate({ name: name.trim(), slug: slug || undefined });
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-10 flex items-center gap-4">
          <span className="relative flex h-6 w-6 items-center justify-center bg-foreground text-xs font-semibold text-background">
            1
          </span>
          <span className="h-px flex-1 bg-border/60" />
          <span className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
            Workspace
          </span>
        </div>

        <h1 className="mt-5 text-2xl md:text-3xl font-semibold leading-[1.1] tracking-tight">
          Create your workspace
        </h1>
        <p className="mt-3 text-xs leading-relaxed font-medium text-muted-foreground">
          Name your organization to set up your first enforcement environment.
          You can always change this later.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-2 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-name" className="text-xs font-medium tracking-wider uppercase text-foreground/70">
              Organization name
            </Label>
            <Input
              id="org-name"
              placeholder="Acme Corp"
              value={name}
              onChange={handleNameChange}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-slug" className="text-xs font-medium tracking-wider uppercase text-foreground/70">
              URL slug
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 pl-2 flex items-center text-sm text-muted-foreground/50">
                traject.app/
              </span>
              <Input
                id="org-slug"
                placeholder="acme-corp"
                style={{ paddingLeft: "5.4rem" }}
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugEdited(true);
                }}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="group font-medium"
            loading={complete.isPending}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create workspace
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Button>
        </form>

        {complete.isError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-sm text-red-500"
          >
            {complete.error instanceof ApiError
              ? complete.error.message
              : "Something went wrong. Please try again."}
          </motion.p>
        )}

        <div className="relative mt-12 flex items-center gap-3">
          <span className="h-px flex-1 bg-border/40" />
          <span className="flex h-1.5 w-1.5 rounded-full bg-border/40" />
          <span className="h-px flex-1 bg-border/40" />
        </div>
      </motion.div>
    </div>
  );
}
