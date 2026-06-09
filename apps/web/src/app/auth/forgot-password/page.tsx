"use client";

import { useEffect, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent, CardFooter } from "@tamor/ui/components/card";
import { forgotPassword } from "@/app/auth/actions";
import Link from "next/link";
import { AuthPageLayout } from "@/components/auth-layout";
import { toastManager } from "@tamor/ui/components/toast";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    forgotPassword,
    undefined,
  );

  useEffect(() => {
    if (state?.error?.form) {
      toastManager.add({
        title: "Error",
        description: state.error.form[0],
        type: "error",
      });
    }
    if (state?.success) {
      toastManager.add({
        title: "Success",
        description: state.success,
        type: "success",
      });
    }
  }, [state]);

  return (
    <AuthPageLayout
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
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
                    className="text-xs text-destructive overflow-hidden"
                  >
                    {state.error.email[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <Button type="submit" loading={pending} className="w-full">
              Send reset link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-none bg-transparent">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageLayout>
  );
}
