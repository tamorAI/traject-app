"use client";

import { useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent, CardFooter } from "@tamor/ui/components/card";
import { login } from "@/app/auth/actions";
import Link from "next/link";
import { AuthPageLayout } from "@/components/auth-layout";
import { toastManager } from "@tamor/ui/components/toast";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.error?.form) {
      toastManager.add({
        title: "Error",
        description: state.error.form[0],
        type: "error",
      });
    }
  }, [state]);

  return (
    <AuthPageLayout
      title="Welcome to Traject"
      description="Sign in or create an account"
    >
      <Card className="bg-transparent rounded-none ring-0 w-full border-0">
        <CardContent>
          <form action={formAction} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <AnimatePresence>
                {state?.error?.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    className="text-sm text-destructive overflow-hidden"
                  >
                    {state.error.email[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
              <AnimatePresence>
                {state?.error?.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    className="text-sm text-destructive overflow-hidden"
                  >
                    {state.error.password[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                type="submit"
                loading={pending}
                size={"lg"}
                className="w-full relative overflow-hidden"
              >
                <span className="relative z-10">Sign in</span>
              </Button>
            </motion.div>
          </form>
        </CardContent>
        <CardFooter className="border-none bg-transparent flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm text-muted-foreground hidden">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageLayout>
  );
}
