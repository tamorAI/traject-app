"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@tamor/ui/lib/utils";
import { ScrollArea } from "@tamor/ui/components/scroll-area";
import {
  User,
  Key,
  Terminal,
  Settings,
  Bell,
  Palette,
  Globe,
  Lock,
  Webhook,
  Code2,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    label: "My Account",
    icon: User,
    items: [
      { label: "Profile", href: "/settings/profile", icon: Settings },
      { label: "General", href: "/settings/general", icon: Globe },
      { label: "Appearance", href: "/settings/appearance", icon: Palette },
      { label: "Notifications", href: "/settings/notifications", icon: Bell },
    ],
  },
  {
    label: "Security",
    icon: Key,
    items: [
      { label: "Password", href: "/settings/security/password", icon: Lock },
      {
        label: "Two-Factor Auth",
        href: "/settings/security/two-factor",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Developer",
    icon: Terminal,
    items: [
      {
        label: "Webhooks",
        href: "/settings/developer/webhooks",
        icon: Webhook,
      },
      { label: "API Keys", href: "/settings/developer/api-keys", icon: Code2 },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="fixed top-0 bottom-0 w-56 pt-[calc(2.5rem+1px)] pb-6">
        <ScrollArea className="h-full">
          <nav className="space-y-6 px-3">
            {sections.map((section) => {
              const sectionActive = section.items.some(
                (item) => pathname === item.href,
              );
              return (
                <div key={section.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <section.icon
                      size={13}
                      className={cn(
                        "text-muted-foreground",
                        sectionActive && "text-foreground/60",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-widest",
                        sectionActive
                          ? "text-foreground/60"
                          : "text-muted-foreground",
                      )}
                    >
                      {section.label}
                    </span>
                  </div>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-accent/60 text-foreground ring-1 ring-border/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                        )}
                      >
                        <item.icon
                          size={15}
                          className={cn(
                            "shrink-0 transition-colors duration-200",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground/60",
                          )}
                        />
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
