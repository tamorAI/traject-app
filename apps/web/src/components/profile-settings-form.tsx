"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { SettingsPageHeader } from "@/components/settings-page-header";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@tamor/ui/components/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tamor/ui/components/avatar";
import { Camera, AtSign, Phone, User, CheckCircle2 } from "lucide-react";
import { toastManager } from "@tamor/ui/components/toast";
import { apiPost } from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_KEY } from "@/hooks/use-auth";

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

export function ProfileSettingsForm({
  initialData,
}: {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
  };
}) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarUrl,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useMutation({
    mutationFn: (data: { name: string }) =>
      apiPost("/update-user", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      toastManager.add({
        title: "Success",
        description: "Profile updated successfully",
        type: "success",
      });
    },
    onError: (err) => {
      toastManager.add({
        title: "Error",
        description: err.message,
        type: "error",
      });
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: (data: { image: string }) =>
      apiPost("/update-user", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      toastManager.add({
        title: "Success",
        description: "Avatar updated",
        type: "success",
      });
    },
    onError: (err) => {
      toastManager.add({
        title: "Error",
        description: err.message,
        type: "error",
      });
    },
  });

  const removeAvatar = useMutation({
    mutationFn: () =>
      apiPost("/update-user", { image: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEY });
      setAvatarPreview(null);
      toastManager.add({
        title: "Success",
        description: "Avatar removed",
        type: "success",
      });
    },
    onError: (err) => {
      toastManager.add({
        title: "Error",
        description: err.message,
        type: "error",
      });
    },
  });

  const initials =
    `${initialData.firstName.charAt(0) || ""}${initialData.lastName.charAt(0) || ""}`.toUpperCase() ||
    "U";

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toastManager.add({
        title: "Error",
        description: "File size must be less than 2MB",
        type: "error",
      });
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toastManager.add({
        title: "Error",
        description: "File must be PNG, JPG, or WebP",
        type: "error",
      });
      return;
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const dataUrl = `data:${file.type};base64,${base64}`;

    setAvatarPreview(dataUrl);
    uploadAvatar.mutate({ image: dataUrl });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name: `${firstName} ${lastName}` });
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl space-y-6"
    >
      <form onSubmit={handleSubmit}>
        <SettingsPageHeader />

        <motion.div variants={cardReveal}>
          <Card className="space-y-4 card-gradient-border overflow-visible">
            <CardHeader className="flex items-center gap-2">
              <div className="rounded-xl bg-muted border p-2 text-muted-foreground">
                <Camera />
              </div>

              <div className="">
                <CardTitle>Avatar</CardTitle>
                <CardDescription>
                  This will be displayed on your profile
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div
                  className="relative"
                  onMouseEnter={() => setAvatarHovered(true)}
                  onMouseLeave={() => setAvatarHovered(false)}
                >
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-70 pulse-ring" />
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent transition-opacity duration-500 group-hover/card:opacity-100" />
                  <div className="relative rounded-full ring-1 ring-border/30">
                    <Avatar className="h-16 w-16 rounded-full">
                      <AvatarImage
                        src={avatarPreview || "/avatar-01.png"}
                        alt="Avatar"
                      />
                      <AvatarFallback className="text-base bg-gradient-to-br from-muted to-muted/50">
                        {initials || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: avatarHovered ? 1 : 0,
                      scale: avatarHovered ? 1 : 0.85,
                      backdropFilter: avatarHovered ? "blur(2px)" : "blur(0px)",
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      animate={
                        avatarHovered ? { rotate: [0, -15, 0] } : { rotate: 0 }
                      }
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <Camera size={18} className="text-white" />
                    </motion.div>
                  </motion.div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative overflow-hidden group/btn"
                      disabled={uploadAvatar.isPending}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="relative z-10">
                        {uploadAvatar.isPending ? "Uploading..." : "Upload new"}
                      </span>
                      <motion.span
                        className="absolute inset-0 bg-accent"
                        initial={false}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      disabled={removeAvatar.isPending}
                      onClick={() => removeAvatar.mutate()}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground/50 font-mono">
                    PNG, JPG. Max 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="mt-5" variants={cardReveal}>
          <Card className="space-y-4 card-gradient-border">
            <CardHeader className="flex items-center gap-2">
              <div className=" rounded-xl p-2 border bg-muted text-muted-foreground">
                <User />
              </div>

              <div>
                <CardTitle className="flex items-center gap-2">
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    defaultValue={initialData.email}
                    className="pl-8"
                    disabled
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-8"
                    defaultValue={initialData.phone}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardReveal}
          className="mt-4 sticky bottom-4 flex items-center justify-between border bg-background/80 backdrop-blur-md px-5 py-3.5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            {updateProfile.isSuccess ? (
              <span className="flex h-2 w-2 bg-success animate-pulse" />
            ) : (
              <span className="flex h-2 w-2 bg-muted-foreground/30" />
            )}
            <p className="text-xs text-muted-foreground/70 font-mono">
              {updateProfile.isSuccess
                ? "Changes saved"
                : "Fill in your details and save"}
            </p>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="sm"
                loading={updateProfile.isPending}
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Save changes
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
