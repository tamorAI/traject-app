"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent, CardFooter } from "@tamor/ui/components/card";
import { login } from "@/app/auth/actions";
import Link from "next/link";
import { AuthPageLayout } from "@/components/auth-layout";

const shakeVariants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4 },
  },
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <AuthPageLayout
      title="Welcome to Traject"
      description="Sign in or create an account"
    >
      {/* Sign In Options */}
      <div className="space-y-3 flex items-center justify-center w-full">
        {/* {preferredSignInOption} */}
      </div>

      {/* Divider */}
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background font-sans text-[#878787]">
            or
          </span>
        </div>
      </div> */}

      {/* More Options Accordion */}
      {/* <LoginAccordion>{moreSignInOptions}</LoginAccordion> */}

      <Card className="bg-transparent rounded-none ring-0 w-full border-0">
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.form
              key={state?.error?.form ? "error" : "idle"}
              variants={state?.error?.form ? shakeVariants : undefined}
              animate={state?.error?.form ? "shake" : undefined}
              action={formAction}
              className="flex flex-col gap-8"
            >
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
              <AnimatePresence>
                {state?.error?.form && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-destructive text-center"
                  >
                    {state.error.form[0]}
                  </motion.p>
                )}
              </AnimatePresence>
              <Button
                type="submit"
                loading={pending}
                size={"lg"}
                className="w-full"
              >
                Sign in
              </Button>
            </motion.form>
          </AnimatePresence>
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
