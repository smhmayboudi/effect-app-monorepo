"use client";

import { LayoutDashboardIcon } from "lucide-react";

import Link from "@/components/ui/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain() {
  const items = [
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard",
      url: "/user/dashboard",
    },
    // {
    //   icon: ListIcon,
    //   title: "Lifecycle",
    //   url: "#",
    // },
    // {
    //   icon: BarChartIcon,
    //   title: "Analytics",
    //   url: "#",
    // },
    // {
    //   icon: FolderIcon,
    //   title: "Projects",
    //   url: "#",
    // },
    // {
    //   icon: UsersIcon,
    //   title: "Team",
    //   url: "#",
    // },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              tooltip="Quick Create"
            >
              <PlusIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              size="icon"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
