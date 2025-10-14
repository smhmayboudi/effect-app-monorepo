"use client";

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
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useDirection } from "@/context/direction-provider";
import { LayoutProvider } from "@/context/layout-provider";

const data1 = {
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

const data2 = [
  {
    id: "262B85F8-8BB8-4DE3-999A-95EA119365EB",
    name: "Test",
    ownerId: "46F0A3A0-4411-4641-8A83-73431689446C",
  },
];

export default function Client() {
  const { dir } = useDirection();
  const defaultOpen = Effect.runSync(
    Cookies.getValue(
      Cookies.fromSetCookie(document.cookie.split(";")),
      "__next_sidebar",
    ).pipe(
      Effect.catchTag("NoSuchElementException", () => Effect.succeed(false)),
      Effect.map((value) => value === "true"),
    ),
  );

  return (
    <LayoutProvider>
      <SidebarProvider
        defaultOpen={defaultOpen}
        direction={dir}
        style={
          {
            "--header-height": "calc(var(--spacing) * 12)",
            "--sidebar-width": "calc(var(--spacing) * 72)",
          } as React.CSSProperties
        }
      >
        <AppSidebar data={data1} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* <SectionCards /> */}
                {/* <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div> */}
                <DataTable data={data2} direction={dir} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}
