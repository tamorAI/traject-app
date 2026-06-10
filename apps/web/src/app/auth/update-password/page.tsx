"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent } from "@tamor/ui/components/card";
import { useUpdatePassword } from "@/hooks/use-auth";
import { AuthPageLayout } from "@/components/auth-layout";
import { useSearchParams } from "next/navigation";

function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const updatePassword = useUpdatePassword();
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword.mutate({ newPassword: password, token });
  };

  return (
    <AuthPageLayout
      title="Update your password"
      description="Enter your new password below"
    >
      <Card className="bg-transparent rounded-none ring-0 w-full border-0">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <AnimatePresence>
              {updatePassword.isError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sm text-destructive text-center"
                >
                  {updatePassword.error?.message ?? "Failed to update password"}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {updatePassword.isSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-sm text-success text-center"
                >
                  Password updated successfully.
                </motion.p>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              loading={updatePassword.isPending}
              className="w-full"
            >
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
