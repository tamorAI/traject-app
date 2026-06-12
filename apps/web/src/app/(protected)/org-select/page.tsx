"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { useOrganizations } from "@/hooks/use-organizations";
import { setStoredOrg } from "@/lib/active-org";
import { Skeleton } from "@tamor/ui/components/skeleton";

export default function OrgSelectPage() {
  const { data: orgs, isLoading } = useOrganizations();
  const router = useRouter();

  function handleSelect(org: NonNullable<typeof orgs>[number]) {
    setStoredOrg({
      id: org.id,
      name: org.name,
      slug: org.slug,
      role: org.role,
    });
    router.push("/overview");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="mb-10 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
              mass: 0.8,
            }}
          >
            <Image src="/logo.png" width={44} height={44} alt="Trajeckt" />
          </motion.div>
        </Link>

        <div className="mt-5 mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border/40" />
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground/50">
            Workspace
          </span>
          <span className="h-px flex-1 bg-border/40" />
        </div>

        <h1 className="text-center text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
          Select your workspace
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
          Choose an organization to open the dashboard.
        </p>

        <div className="mt-8 space-y-2">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border border-border/50 p-4"
                >
                  <Skeleton className="size-10" />
                  <div className="grid flex-1 gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </>
          ) : orgs && orgs.length > 0 ? (
            orgs.map((org, i) => (
              <motion.button
                key={org.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 * i,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                onClick={() => handleSelect(org)}
                className="group relative flex w-full items-center gap-4 border border-border/50 bg-background p-4 text-left transition-all hover:border-foreground/20 hover:bg-muted/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center">
                  <Building2 className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{org.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground/60 capitalize">
                    {org.role.toLowerCase()}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/60" />
              </motion.button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border/50 p-8 text-center">
              <Building2 className="mx-auto mb-3 size-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No workspaces found.
              </p>
              <Link
                href="/onboarding"
                className="mt-3 inline-block text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Create one
              </Link>
            </div>
          )}
        </div>

        <div className="relative mt-10 flex items-center gap-3">
          <span className="h-px flex-1 bg-border/30" />
          <span className="flex h-1 w-1 rounded-full bg-border/30" />
          <span className="h-px flex-1 bg-border/30" />
        </div>
      </motion.div>
    </div>
  );
}
