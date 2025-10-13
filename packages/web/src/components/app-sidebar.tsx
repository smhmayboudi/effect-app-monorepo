"use client";

import type { LucideIcon } from "lucide-react";

import { AppTitle } from "@/components/app-title";
// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";

export function AppSidebar({
  data,
}: {
  data: {
    navDocuments: Array<{
      icon: LucideIcon;
      title: string;
      url: string;
    }>;
    navMain: Array<{
      icon: LucideIcon;
      title: string;
      url: string;
    }>;
    navSecondary: Array<{
      icon: LucideIcon;
      title: string;
      url: string;
    }>;
    user: {
      avatar: string;
      email: string;
      name: string;
    };
  };
}) {
  const { collapsible, variant } = useLayout();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.navDocuments} /> */}
        {/* <NavSecondary items={data.navSecondary} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser isHeader={false} user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
