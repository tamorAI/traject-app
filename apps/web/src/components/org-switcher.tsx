"use client";
import { Boxes, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tamor/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@tamor/ui/components/sidebar";
import { useOrganizations, type Organization } from "@/hooks/use-organizations";
import { getStoredOrg, setStoredOrg } from "@/lib/active-org";
import { Skeleton } from "@tamor/ui/components/skeleton";

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const { data: orgs, isLoading } = useOrganizations();
  const [activeOrg, setActiveOrg] = React.useState<Organization | null>(null);

  React.useEffect(() => {
    const stored = getStoredOrg();
    if (stored && orgs) {
      const match = orgs.find((o) => o.id === stored.id) ?? orgs[0] ?? null;
      setActiveOrg(match);
    } else if (orgs && orgs.length > 0) {
      setActiveOrg(orgs[0]);
    }
  }, [orgs]);

  function handleSwitch(org: Organization) {
    setStoredOrg({ id: org.id, name: org.name, slug: org.slug, role: org.role });
    setActiveOrg(org);
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="gap-3">
            <Skeleton className="size-8 rounded-lg" />
            <div className="grid gap-0.5 text-left">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeOrg) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Boxes className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeOrg.name}</span>
                  <span className="truncate text-xs capitalize">
                    {activeOrg.role.toLowerCase()}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-96!"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="mb-2 text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {orgs?.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitch(org)}
                  className="gap-2 px-2 py-1.5"
                >
                  <div className="flex-1 truncate">{org.name}</div>
                  <span className="text-[10px] uppercase font-medium text-muted-foreground">
                    {org.role === "OWNER" ? "Owner" : org.role.toLowerCase()}
                  </span>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <Plus className="size-4" />
                <div className="text-muted-foreground font-medium">
                  Add organization
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
