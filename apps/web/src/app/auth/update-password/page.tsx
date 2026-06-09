"use client";

import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent } from "@tamor/ui/components/card";
import { supabaseClient } from "@/supabase/client";
import { updatePassword } from "@/app/auth/actions";
import { AuthPageLayout } from "@/components/auth-layout";

export default function UpdatePasswordPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!sessionReady) {
    return (
      <AuthPageLayout
        title="Update your password"
        description="Use the link from your email to access this page."
      >
        <Card className="bg-transparent rounded-none ring-0 w-full border-0">
          <CardContent className="flex justify-center py-8">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent"
            />
          </CardContent>
        </Card>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      title="Update your password"
      description="Enter your new password below"
    >
      <Card className="bg-transparent rounded-none ring-0 w-full border-0">
        <CardContent>
          <form action={formAction} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">New password</Label>
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
            <AnimatePresence>
              {state?.success && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sm text-success text-center"
                >
                  {state.success}
                </motion.p>
              )}
            </AnimatePresence>
            <Button type="submit" loading={pending} className="w-full">
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
