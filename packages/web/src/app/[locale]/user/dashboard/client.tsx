"use client"

import type { CSSProperties } from "react"

import { Result, useAtomValue } from "@effect-atom/atom-react"
import * as Cookies from "@effect/platform/Cookies"
import { ActorId } from "@template/domain/Actor"
import {
  Service,
  ServiceId,
} from "@template/domain/service/application/ServiceApplicationDomain"
import * as Effect from "effect/Effect"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LayoutProvider } from "@/context/layout-provider"
import { useSearchNavigation } from "@/hooks/use-search-navigation"
import { authClient } from "@/lib/auth-client"
import { HttpClient } from "@/lib/http-client"
import { cn } from "@/lib/utils"

import { ServicesDialogs } from "./components/services-dialogs"
import { ServicesPrimaryButtons } from "./components/services-primary-buttons"
import { ServicesProvider } from "./components/services-provider"
import { ServicesTable } from "./components/services-table"

export default function Client() {
  const t = useTranslations("user.dashboard")
  const { data } = authClient.useSession()

  const readAll = useMemo(
    () =>
      HttpClient.query("service", "readAll", {
        reactivityKeys: ["services"],
        urlParams: data?.user.id
          ? {
              filters: [
                {
                  column: "ownerId",
                  operator: "=",
                  value: data.user.id,
                },
              ],
              sort: [{ column: "ownerId", sort: "ASC" }],
            }
          : { sort: [{ column: "ownerId", sort: "ASC" }] },
      }),
    [data?.user.id],
  )
  const result = useAtomValue(readAll)

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
  )

  const { navigate, search } = useSearchNavigation()

  const transformServices = (
    services?: ReadonlyArray<Partial<Service>>,
  ): Array<Service> => {
    const now = new Date()

    return (services ?? []).map((service) => ({
      createdAt: service.createdAt ?? now,
      deletedAt: service.deletedAt ?? null,
      id: service.id ?? ServiceId.make("00000000-0000-0000-0000-000000000000"),
      name: service.name ?? "",
      ownerId:
        service.ownerId ?? ActorId.make("00000000-0000-0000-0000-000000000000"),
      updatedAt: service.updatedAt ?? now,
    }))
  }

  return Result.builder(result)
    .onDefect((defect) => <div>Defect: {String(defect)}</div>)
    .onErrorTag("ActorErrorUnauthorized", (error) => (
      <div>ActorErrorUnauthorized: {error.toString()}</div>
    ))
    .onErrorTag("ParseError", (error) => (
      <div>ParseError: {error.toString()}</div>
    ))
    .onErrorTag("RequestError", (error) => (
      <div>RequestError: {error.toString()}</div>
    ))
    .onErrorTag("ResponseError", (error) => (
      <div>ResponseError: {error.toString()}</div>
    ))
    .onInitial(() => <div>Initial...</div>)
    .onSuccess((services) => (
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
                <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                  <div
                    className={cn(
                      // Set content container, so we can use container queries
                      "@container/content",
                      // If layout is fixed, set the height
                      // to 100svh to prevent overflow
                      "has-[[data-layout=fixed]]:h-svh",
                      // If layout is fixed and sidebar is inset,
                      // set the height to 100svh - spacing (total margins) to prevent overflow
                      "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]",
                    )}
                  >
                    <ServicesProvider>
                      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">
                            {t("service-list-title")}
                          </h2>
                          <p className="text-muted-foreground">
                            {t("service-list-description")}
                          </p>
                        </div>
                        <ServicesPrimaryButtons />
                      </div>
                      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                        <ServicesTable
                          data={transformServices(services.data)}
                          navigate={navigate}
                          search={search}
                        />
                      </div>
                      <ServicesDialogs />
                    </ServicesProvider>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    ))
    .onWaiting(() => <div>Waiting...</div>)
    .render()
}
