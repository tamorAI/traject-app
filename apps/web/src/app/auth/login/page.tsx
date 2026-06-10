"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Card, CardContent, CardFooter } from "@tamor/ui/components/card";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { AuthPageLayout } from "@/components/auth-layout";
import { toastManager } from "@tamor/ui/components/toast";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    login.mutate(
      { email, password },
      {
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : "Invalid email or password. Please try again.";
          toastManager.add({
            title: "Sign in failed",
            description: message,
            type: "error",
          });
        },
      },
    );
  };

  return (
    <AuthPageLayout
      title="Welcome to Traject"
      description="Sign in or create an account"
    >
      <Card className="bg-transparent rounded-none ring-0 w-full border-0">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                type="submit"
                loading={login.isPending}
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
        </CardFooter>
      </Card>
    </AuthPageLayout>
  );
}
