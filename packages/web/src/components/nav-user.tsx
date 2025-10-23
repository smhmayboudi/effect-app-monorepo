"use client";

import * as Effect from "effect/Effect";
import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "@/components/ui/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { withToast } from "@/components/with-toast";
import { authClient } from "@/lib/auth-client";

export function NavUser({ isHeader }: { isHeader: boolean }) {
  const { isMobile } = useSidebar();
  const { data } = authClient.useSession();
  const router = useRouter();

  const handleAccount = async () => {
    router.push("/user/update");
  };

  const handleSignOut = async () => {
    const result = await Effect.runPromise(
      Effect.tryPromise({
        catch: (error) => new Error(String(error)),
        try: (signal) => authClient.signOut({}, { signal }),
      }).pipe(
        withToast({
          onFailure: (e) => `Failed to sign out. ${e.message}`,
          onSuccess: () => `Sign out successfully!`,
          onWaiting: "onWaiting",
        }),
      ),
    );
    if (result.data) {
      router.push("/");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size={!isHeader ? "lg" : "default"}
            >
              <Avatar
                className={`size-8 ${!isHeader ? "rounded-lg" : "rounded-sm"} grayscale`}
              >
                <AvatarImage
                  alt={data?.user.name ?? ""}
                  src={data?.user.image ?? ""}
                />
                <AvatarFallback
                  className={!isHeader ? "rounded-lg" : "rounded-sm"}
                >
                  CN
                </AvatarFallback>
              </Avatar>
              {!isHeader && (
                <>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data?.user.name ?? ""}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {data?.user.email ?? ""}
                    </span>
                  </div>
                  <MoreVerticalIcon className="ms-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : !isHeader ? "right" : "top"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    alt={data?.user.name ?? ""}
                    src={data?.user.image ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">
                    {data?.user.name ?? ""}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {data?.user.email ?? ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccount}>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
