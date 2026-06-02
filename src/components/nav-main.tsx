"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@tamor/ui/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "@tamor/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@tamor/ui/components/sidebar";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
};

function getPathname(href?: string) {
  return href?.split("#")[0] ?? "";
}

function matchesRoute(item: NavItem, pathname: string) {
  if (!item.title || !item.href) return false;

  const itemPathname = getPathname(item.href);

  if (itemPathname !== pathname) {
    return false;
  }

  if (itemPathname !== "/") {
    return true;
  }

  return item.title === "Dashboard";
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item, index) => (
        <NavMainItem
          key={item.title || item.label || index}
          item={item}
          pathname={pathname}
        />
      ))}
    </>
  );
}

function NavMainItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const hasChildren = !!item.children?.length;
  const isRouteActive = matchesRoute(item, pathname);
  const [isOpen, setIsOpen] = React.useState(isRouteActive);

  if (item.isSection && item.label) {
    return (
      <SidebarGroup className="p-0 pt-5 first:pt-0">
        <SidebarGroupLabel className="p-0 text-xs uppercase text-sidebar-foreground">
          {item.label}
        </SidebarGroupLabel>
      </SidebarGroup>
    );
  }

  if (hasChildren && item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem>
              <CollapsibleTrigger
                className="w-full"
                render={
                  <SidebarMenuButton
                    id={`nav-main-trigger-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    tooltip={item.title}
                    isActive={isRouteActive}
                    className={cn(
                      "text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                      isRouteActive ? "bg-primary! text-primary-foreground!" : "",
                    )}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200",
                        isOpen && "rotate-90",
                      )}
                    />
                  </SidebarMenuButton>
                }
              />
              <CollapsiblePanel>
                <SidebarMenuSub className="me-0 pe-0">
                  {item.children!.map((child, index) => (
                    <NavMainSubItem
                      key={child.title || index}
                      item={child}
                      pathname={pathname}
                      parentTitle={item.title}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsiblePanel>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  if (item.title) {
    return (
      <SidebarGroup className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              id={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              tooltip={item.title}
              isActive={isRouteActive}
              className={cn(
                "rounded-md text-sm font-medium px-3 py-2 h-9 transition-colors cursor-pointer",
                isRouteActive ? "bg-primary! text-primary-foreground!" : "",
              )}
              render={<Link href={item.href ?? "#"} prefetch={false} />}
            >
              {item.icon && <item.icon />}
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return null;
}

function NavMainSubItem({
  item,
  pathname,
  parentTitle,
}: {
  item: NavItem;
  pathname: string;
  parentTitle?: string;
}) {
  const hasChildren = !!item.children?.length;
  const isRouteActive = matchesRoute(item, pathname);
  const [isOpen, setIsOpen] = React.useState(isRouteActive);

  if (hasChildren && item.title) {
    return (
      <SidebarMenuSubItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger
            className="w-full"
            render={
              <SidebarMenuSubButton
                id={`nav-sub-trigger-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-md text-sm font-medium px-3 py-2 h-9"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto transition-transform duration-200",
                    isOpen && "rotate-90",
                  )}
                />
              </SidebarMenuSubButton>
            }
          />
          <CollapsiblePanel>
            <SidebarMenuSub className="me-0 pe-0">
              {item.children!.map((child, index) => (
                <NavMainSubItem
                  key={child.title || index}
                  item={child}
                  pathname={pathname}
                  parentTitle={parentTitle}
                />
              ))}
            </SidebarMenuSub>
          </CollapsiblePanel>
        </Collapsible>
      </SidebarMenuSubItem>
    );
  }

  if (item.title) {
    return (
      <SidebarMenuSubItem className="w-full">
        <SidebarMenuSubButton
          id={`nav-sub-button-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
          className={cn(
            "w-full rounded-md transition-colors",
            isRouteActive ? "bg-muted! text-foreground!" : "",
          )}
          isActive={isRouteActive}
          render={<Link href={item.href ?? "#"} prefetch={false} />}
        >
          {item.title}
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  return null;
}
