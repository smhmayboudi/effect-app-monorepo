"use client";

import type { CSSProperties } from "react";

import { Cookies } from "@effect/platform";
import { Effect } from "effect";
import {
  BarChartIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutProvider } from "@/context/layout-provider";

import data from "./data.json";

const dataSide = {
  navDocuments: [
    {
      icon: DatabaseIcon,
      title: "Data Library",
      url: "#",
    },
    {
      icon: ClipboardListIcon,
      title: "Reports",
      url: "#",
    },
    {
      icon: FileIcon,
      title: "Word Assistant",
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

export default function Client() {
  const defaultOpen = Effect.runSync(
    Cookies.getValue(
      Cookies.fromSetCookie(
        typeof document === "undefined" ? [] : document.cookie.split(";"),
      ),
      "__next_sidebar",
    ).pipe(
      Effect.catchTag("NoSuchElementException", () => Effect.succeed("true")),
      Effect.map((value) => value === "true"),
    ),
  );

  return (
    <LayoutProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--header-height": "calc(var(--spacing) * 12)",
            "--sidebar-width": "calc(var(--spacing) * 72)",
          } as CSSProperties
        }
      >
        <AppSidebar data={dataSide} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}
