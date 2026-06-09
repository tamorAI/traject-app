"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "@tamor/ui/components/dialog";
import { Button } from "@tamor/ui/components/button";
import { Input } from "@tamor/ui/components/input";
import { Label } from "@tamor/ui/components/label";
import { Textarea } from "@tamor/ui/components/textarea";
import { toastManager } from "@tamor/ui/components/toast";

const requestDemoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().optional(),
});

interface RequestDemoContextValue {
  open: () => void;
}

const RequestDemoContext = createContext<RequestDemoContextValue>({
  open: () => {},
});

export function useRequestDemo() {
  return useContext(RequestDemoContext);
}

export function RequestDemoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);

  return (
    <RequestDemoContext.Provider value={{ open: handleOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <RequestDemoDialog onClose={() => setOpen(false)} />
      </Dialog>
    </RequestDemoContext.Provider>
  );
}

function RequestDemoDialog({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: (formData.get("name") as string) ?? "",
      email: (formData.get("email") as string) ?? "",
      company: (formData.get("company") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
    };

    const parsed = requestDemoSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(
        parsed.error.flatten().fieldErrors,
      )) {
        fieldErrors[key] = (msgs as string[])[0];
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/request-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.form?.[0] ?? "Failed to send request");
      }

      toastManager.add({
        title: "Request sent!",
        description: "We'll be in touch shortly.",
        type: "success",
      });
      onClose();
    } catch (err) {
      toastManager.add({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Request a Demo</DialogTitle>
        <DialogDescription>
          See how Trajeckt can help your team govern AI agent execution.
        </DialogDescription>
      </DialogHeader>
      <DialogPanel>
        <form
          id="request-demo-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              name="company"
              placeholder="Company name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your use case..."
              rows={3}
            />
          </div>
        </form>
      </DialogPanel>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>
          Cancel
        </DialogClose>
        <Button
          type="submit"
          form="request-demo-form"
          loading={submitting}
        >
          Send Request
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function RequestDemoButton({
  children,
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open } = useRequestDemo();
  return (
    <Button
      onClick={open}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}
