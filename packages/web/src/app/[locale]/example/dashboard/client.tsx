"use client";

import type { CSSProperties } from "react";

import * as Cookies from "@effect/platform/Cookies";
import * as Effect from "effect/Effect";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutProvider } from "@/context/layout-provider";

import data from "./data.json";

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
        <AppSidebar />
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
