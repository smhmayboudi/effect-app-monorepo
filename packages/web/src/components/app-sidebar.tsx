"use client";

import {
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import { AppTitle } from "@/components/app-title";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";

const data = {
  documents: [
    {
      icon: DatabaseIcon,
      name: "Data Library",
      url: "#",
    },
    {
      icon: ClipboardListIcon,
      name: "Reports",
      url: "#",
    },
    {
      icon: FileIcon,
      name: "Word Assistant",
      url: "#",
    },
  ],
  navClouds: [
    {
      icon: CameraIcon,
      isActive: true,
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Capture",
      url: "#",
    },
    {
      icon: FileTextIcon,
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Proposal",
      url: "#",
    },
    {
      icon: FileCodeIcon,
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
      title: "Prompts",
      url: "#",
    },
  ],
  navMain: [
    {
      icon: LayoutDashboardIcon,
      title: "Dashboard",
      url: "#",
    },
    {
      icon: ListIcon,
      title: "Lifecycle",
      url: "#",
    },
    {
      icon: BarChartIcon,
      title: "Analytics",
      url: "#",
    },
    {
      icon: FolderIcon,
      title: "Projects",
      url: "#",
    },
    {
      icon: UsersIcon,
      title: "Team",
      url: "#",
    },
  ],
  navSecondary: [
    {
      icon: SettingsIcon,
      title: "Settings",
      url: "#",
    },
    {
      icon: HelpCircleIcon,
      title: "Get Help",
      url: "#",
    },
    {
      icon: SearchIcon,
      title: "Search",
      url: "#",
    },
  ],
  user: {
    avatar: "/shadcn.jpg",
    email: "m@example.com",
    name: "shadcn",
  },
};

export function AppSidebar() {
  const { collapsible, variant } = useLayout();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary className="mt-auto" items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isHeader={false} user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
