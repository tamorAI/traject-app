"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@tamor/ui/components/avatar";
import { Button } from "@tamor/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@tamor/ui/components/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@tamor/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tamor/ui/components/tooltip";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import {
  BookmarkPlus,
  CircleHelp,
  LogOut,
  Plus,
  PlusCircle,
  Puzzle,
  Settings,
  User,
} from "lucide-react";

export function NavFooter({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "TR";

  return (
    <SidebarFooter className="p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2">
                  <DropdownMenuLabel className="space-y-0.5">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings/profile")}
                  >
                    <User size={16} className="opacity-80" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/settings/general")}
                  >
                    <Settings
                      size={16}
                      className="opacity-80"
                      aria-hidden="true"
                    />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut
                      size={16}
                      className="opacity-80"
                      aria-hidden="true"
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp
                      size={16}
                      aria-hidden="true"
                      className="cursor-pointer opacity-60 hover:opacity-100"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="py-1 px-2 m-2 max-w-[150px] border bg-popover text-popover-foreground"
                  >
                    <div className="space-y-1 text-xs">
                      <p className="font-medium">Account context</p>
                      <p className="text-muted-foreground">
                        Quick access to the signed-in account and workspace
                        actions.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Open edit menu"
                >
                  <Plus size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="pb-2">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PlusCircle
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Create policy
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookmarkPlus
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Open incident review
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Puzzle
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Add integration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
