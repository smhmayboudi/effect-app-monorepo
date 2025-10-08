"use client";

import ServiceList from "@/components/service-list";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import Link from "@/components/ui/link";
import { GalleryVerticalEnd } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Client() {
  const t = useTranslations("user.dashboard");
  const { data } = authClient.useSession();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceList userId={data?.user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
