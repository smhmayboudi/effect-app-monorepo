import data from "./data.json";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      direction={locale === "fa" ? "rtl" : "ltr"}
    >
      <AppSidebar variant="inset" direction={locale === "fa" ? "rtl" : "ltr"} />
      <SidebarInset>
        <SiteHeader direction={locale === "fa" ? "rtl" : "ltr"} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive
                  direction={locale === "fa" ? "rtl" : "ltr"}
                />
              </div>
              <DataTable
                data={data}
                direction={locale === "fa" ? "rtl" : "ltr"}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
