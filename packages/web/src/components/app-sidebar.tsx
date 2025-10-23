"use client";

import { AppTitle } from "@/components/app-title";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {/* <NavDocuments items={data.navDocuments} /> */}
        {/* <NavSecondary items={data.navSecondary} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser isHeader={false} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
