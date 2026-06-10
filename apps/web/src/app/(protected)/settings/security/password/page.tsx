"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { SettingsPageHeader } from "@/components/settings-page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tamor/ui/components/card";
import { Label } from "@tamor/ui/components/label";
import { Input } from "@tamor/ui/components/input";
import { Button } from "@tamor/ui/components/button";
import { toastManager } from "@tamor/ui/components/toast";
import { apiPost } from "@/lib/api/client";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

const springConfig = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springConfig, stiffness: 300, damping: 26 },
  },
};

export default function PasswordSettingsPage() {
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiPost("/change-password", data),
    onSuccess: () => {
      toastManager.add({
        title: "Success",
        description: "Password updated successfully",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
    },
    onError: (err) => {
      toastManager.add({
        title: "Error",
        description: err.message,
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastManager.add({
        title: "Error",
        description: "Passwords do not match",
        type: "error",
      });
      return;
    }
    updatePassword.mutate({ currentPassword, newPassword });
  };

  const simulateStrength = (val: string) => {
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const len = val.length;
    let score = 0;
    if (len > 6) score++;
    if (len > 10) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    setPasswordStrength(Math.min(score, 5));
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SettingsPageHeader />

      <motion.div variants={cardReveal}>
        <Card className="card-gradient-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 border bg-muted text-muted-foreground">
                  <KeyRound />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Use a strong password you don&apos;t use elsewhere
                  </CardDescription>
                </div>
              </div>
              {passwordStrength > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1"
                >
                  <ShieldCheck
                    size={12}
                    className={
                      passwordStrength >= 4
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    }
                  />
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {strengthLabel[passwordStrength]}
                  </span>
                </motion.div>
              )}
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={show.current ? "text" : "password"}
                    placeholder="Enter current password"
                    className="pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShow((s) => ({ ...s, current: !s.current }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={show.new ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      simulateStrength(e.target.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {show.new ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordStrength > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex gap-1 pt-1"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: i < passwordStrength ? 1 : 0,
                          opacity: i < passwordStrength ? 1 : 0.15,
                        }}
                        transition={{ delay: i * 0.05, ...springConfig }}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength
                            ? strengthColor[passwordStrength]
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={show.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShow((s) => ({ ...s, confirm: !s.confirm }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                  >
                    {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="h-px bg-border/40" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <Lock size={12} />
                <span>Password must be at least 8 characters long</span>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={updatePassword.isPending}
              >
                {updatePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
